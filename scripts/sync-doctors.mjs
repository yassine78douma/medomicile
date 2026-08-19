import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const outputPath = path.resolve(process.env.DOCTORS_SYNC_OUTPUT || path.join(root, "data", "doctors.json"));
const localSource = process.env.DOCTORS_SYNC_SOURCE_FILE;
const allowDoctorDrop = process.env.ALLOW_DOCTOR_DROP === "true";
const sheetRange = process.env.GOOGLE_SHEET_RANGE || "Médecins!A:Z";

const columns = {
  id: ["id"],
  lastName: ["nom", "last name", "lastname"],
  firstName: ["prénom", "prenom", "first name", "firstname"],
  title: ["titre", "title"],
  specialty: ["spécialité", "specialite", "specialty"],
  subSpecialty: ["sous-spécialité", "sous-specialite", "sub specialty", "subspecialty"],
  city: ["ville", "city"],
  district: ["quartier", "district"],
  address: ["adresse", "address"],
  phone: ["téléphone", "telephone", "phone"],
  whatsapp: ["whatsapp", "wa"],
  googleMaps: ["google maps", "google map", "maps", "itinéraire", "itineraire"],
  googleRating: ["note google", "google rating", "rating"],
  googleReviews: ["nombre d’avis", "nombre d'avis", "avis google", "google reviews", "reviews"],
  hours: ["horaires", "hours"],
  languages: ["langues", "languages"],
  image: ["photo", "image"],
  status: ["statut", "status"],
  verified: ["vérifié", "verifie", "verified"],
  featured: ["mis en avant", "featured"],
  updatedAt: ["dernière vérification", "derniere verification", "updated_at", "updated at"]
};

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

function buildHeaderMap(headerRow) {
  const normalized = headerRow.map(normalizeHeader);
  const map = {};
  for (const [field, aliases] of Object.entries(columns)) {
    const aliasSet = aliases.map(normalizeHeader);
    map[field] = normalized.findIndex((header) => aliasSet.includes(header));
  }
  return map;
}

function get(row, headerMap, field) {
  const index = headerMap[field];
  return index >= 0 ? clean(row[index]) : "";
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return clean(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizePhone(value) {
  return clean(value)
    .replace(/[().]/g, " ")
    .replace(/\s*[/|;]\s*/g, " / ")
    .replace(/\s+/g, " ");
}

function phoneList(value) {
  return normalizePhone(value)
    .split(/\s*\/\s*|\s*;\s*|\s*\|\s*/)
    .map(clean)
    .filter(Boolean);
}

function toBoolean(value) {
  const normalized = normalizeHeader(value);
  if (["oui", "yes", "true", "vrai", "1", "x"].includes(normalized)) return true;
  if (["non", "no", "false", "faux", "0"].includes(normalized)) return false;
  return false;
}

function toNumber(value) {
  const cleaned = clean(value).replace(",", ".");
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function toInteger(value) {
  const number = toNumber(value);
  return number === null ? null : Math.trunc(number);
}

function toList(value) {
  return clean(value)
    .split(/\s*[,;|]\s*/)
    .map(clean)
    .filter(Boolean);
}

function normalizeStatus(value) {
  const status = normalizeHeader(value);
  if (["active", "actif", "publie", "publiee", "published"].includes(status)) return "active";
  if (["inactive", "inactif", "masque", "masquee", "hidden"].includes(status)) return "inactive";
  if (["draft", "brouillon", "a verifier", "a-verifier"].includes(status)) return "draft";
  return status ? "draft" : "draft";
}

function normalizeRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Le Google Sheet ne contient aucune ligne.");
  }

  const headerMap = buildHeaderMap(rows[0]);
  const doctors = rows.slice(1)
    .filter((row) => row.some((cell) => clean(cell)))
    .map((row, index) => {
      const firstName = get(row, headerMap, "firstName");
      const lastName = get(row, headerMap, "lastName");
      const title = get(row, headerMap, "title") || "Dr";
      const fullName = clean([title, firstName, lastName].filter(Boolean).join(" "));
      const explicitId = get(row, headerMap, "id");
      const phone = normalizePhone(get(row, headerMap, "phone"));
      const id = explicitId || slugify(fullName || `doctor-${index + 1}`);

      if (!id) throw new Error(`Ligne ${index + 2}: ID ou nom obligatoire.`);
      if (!fullName) throw new Error(`Ligne ${index + 2}: nom/prénom/titre manquant.`);

      return {
        id,
        name: fullName,
        title,
        specialty: get(row, headerMap, "specialty"),
        sub_specialty: get(row, headerMap, "subSpecialty"),
        city: get(row, headerMap, "city") || "Kénitra",
        district: get(row, headerMap, "district"),
        address: get(row, headerMap, "address"),
        phone,
        phones: phoneList(phone),
        whatsapp: normalizePhone(get(row, headerMap, "whatsapp")),
        google_maps: get(row, headerMap, "googleMaps"),
        google_rating: toNumber(get(row, headerMap, "googleRating")),
        google_reviews: toInteger(get(row, headerMap, "googleReviews")),
        hours: get(row, headerMap, "hours"),
        languages: toList(get(row, headerMap, "languages")),
        image: get(row, headerMap, "image"),
        status: normalizeStatus(get(row, headerMap, "status")),
        verified: toBoolean(get(row, headerMap, "verified")),
        featured: toBoolean(get(row, headerMap, "featured")),
        updated_at: get(row, headerMap, "updatedAt")
      };
    });

  const ids = new Set();
  for (const doctor of doctors) {
    if (ids.has(doctor.id)) throw new Error(`ID médecin dupliqué: ${doctor.id}`);
    ids.add(doctor.id);
  }

  return doctors;
}

async function getGoogleToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  })).toString("base64url");
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(`${header}.${payload}`)
    .sign(serviceAccount.private_key, "base64url");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${payload}.${signature}`
    })
  });

  if (!response.ok) {
    throw new Error(`Google OAuth a échoué: ${response.status} ${await response.text()}`);
  }

  const token = await response.json();
  return token.access_token;
}

async function readGoogleSheet() {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!sheetId) throw new Error("GOOGLE_SHEETS_ID est manquant.");
  if (!serviceAccountJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON est manquant.");

  const serviceAccount = JSON.parse(serviceAccountJson);
  const token = await getGoogleToken(serviceAccount);
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetRange)}`);
  url.searchParams.set("majorDimension", "ROWS");

  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) {
    throw new Error(`Lecture Google Sheets impossible: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.values || [];
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted && char === '"' && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(cell);
      cell = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function rowsFromLocalSource(sourcePath) {
  const resolved = path.resolve(root, sourcePath);
  const text = fs.readFileSync(resolved, "utf8");
  if (resolved.endsWith(".json")) {
    const json = JSON.parse(text);
    if (Array.isArray(json.doctors)) return doctorsToRows(json.doctors);
    if (Array.isArray(json)) return json;
    throw new Error("Le fichier JSON local doit contenir un tableau ou une clé doctors.");
  }
  return parseCsv(text);
}

function doctorsToRows(doctors) {
  const header = [
    "ID", "Nom", "Prénom", "Titre", "Spécialité", "Sous-spécialité", "Ville", "Quartier",
    "Adresse", "Téléphone", "WhatsApp", "Google Maps", "Note Google", "Nombre d’avis",
    "Horaires", "Langues", "Photo", "Statut", "Vérifié", "Mis en avant", "Dernière vérification"
  ];
  const rows = doctors.map((doctor) => [
    doctor.id,
    clean(doctor.name).replace(/^Dr\\s+/i, ""),
    "",
    doctor.title || "Dr",
    doctor.specialty,
    doctor.sub_specialty,
    doctor.city,
    doctor.district,
    doctor.address,
    doctor.phone || (doctor.phones || []).join(" / "),
    doctor.whatsapp,
    doctor.google_maps,
    doctor.google_rating,
    doctor.google_reviews,
    doctor.hours,
    (doctor.languages || []).join(", "),
    doctor.image,
    doctor.status,
    doctor.verified ? "oui" : "non",
    doctor.featured ? "oui" : "non",
    doctor.updated_at
  ]);
  return [header, ...rows];
}

function readPreviousCount() {
  if (!fs.existsSync(outputPath)) return 0;
  const previous = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  if (!Array.isArray(previous.doctors)) return 0;
  return previous.doctors.length;
}

function assertSafeReplacement(nextDoctors) {
  const previousCount = readPreviousCount();
  if (!previousCount || allowDoctorDrop) return;
  if (nextDoctors.length <= previousCount * 0.5) {
    throw new Error(
      `Synchronisation refusée: ${nextDoctors.length} médecins générés contre ${previousCount} existants. ` +
      "Définissez ALLOW_DOCTOR_DROP=true uniquement si cette suppression est volontaire."
    );
  }
}

async function main() {
  const rows = localSource ? rowsFromLocalSource(localSource) : await readGoogleSheet();
  const doctors = normalizeRows(rows);
  assertSafeReplacement(doctors);

  const payload = {
    updated_at: new Date().toISOString().slice(0, 10),
    source: localSource ? `local:${localSource}` : `google-sheets:${sheetRange}`,
    doctors
  };

  if (!Array.isArray(payload.doctors)) throw new Error("JSON invalide: doctors doit être un tableau.");
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  JSON.parse(json);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const tmpPath = `${outputPath}.tmp`;
  fs.writeFileSync(tmpPath, json, "utf8");
  fs.renameSync(tmpPath, outputPath);
  console.log(`Doctors synced: ${doctors.length} fiches écrites dans ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
