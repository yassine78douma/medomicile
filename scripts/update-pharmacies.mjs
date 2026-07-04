import { readFile, writeFile } from "node:fs/promises";

const SOURCE_URL = "https://pharmaciedegardekenitra.com/";
const SOURCE_API_URL = "https://pharmaciedegardekenitra.com/wp-json/wp/v2/pages/3846";
const OUTPUT = new URL("../data/pharmacies-garde.json", import.meta.url);
const SCRIPT = new URL("../script.js", import.meta.url);
const FETCH_RETRIES = 4;
const FETCH_TIMEOUT_MS = 20000;

const decodeHtml = (value = "") =>
  value
    .replace(/&#8211;/g, "-")
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const stripTags = (value = "") =>
  decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

const firstMatch = (value, pattern) => value.match(pattern)?.[1]?.trim() || "";

const normalizePhone = (value = "") => {
  const phones = value.match(/(?:\+?212|0)\s?[\d\s.-]{8,}/g) || [];
  return phones
    .map((phone) => phone.replace(/\s+/g, " ").replace(/[.-]/g, " ").trim())
    .filter((phone, index, items) => items.indexOf(phone) === index)[0] || "";
};

const splitNames = (value) => {
  const clean = stripTags(value);
  const arabic = clean.match(/[\u0600-\u06ff][\u0600-\u06ff\s]+/)?.[0]?.trim() || "";
  const latin = clean
    .replace(arabic, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    name: latin || clean || "Pharmacie de garde",
    nameAr: arabic,
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTextWithRetries = async (url) => {
  let lastError;

  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          "accept": "text/html,application/json",
          "user-agent": "Medomicile pharmacy updater (+https://medomicile.com/)",
        },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Source unavailable: ${response.status}`);
      return response.text();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${FETCH_RETRIES} failed for ${url}: ${error.message}`);
      if (attempt < FETCH_RETRIES) await sleep(attempt * 3000);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
};

const fetchHtml = async () => {
  try {
    const jsonText = await fetchTextWithRetries(SOURCE_API_URL);
    const page = JSON.parse(jsonText);
    return {
      html: `${page.title?.rendered || ""}\n${page.content?.rendered || ""}`,
      updatedAt: page.modified ? `${page.modified}+01:00` : "",
    };
  } catch (error) {
    console.warn(`WordPress API source failed, retrying public page: ${error.message}`);
  }

  return {
    html: await fetchTextWithRetries(SOURCE_URL),
    updatedAt: "",
  };
};

const parsePharmacies = (html) => {
  const tableMatches = [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => match[0]);

  return tableMatches
    .map((table) => {
      const heading = firstMatch(table, /<thead[\s\S]*?<tr[\s\S]*?<t[hd][^>]*>([\s\S]*?)<\/t[hd]>[\s\S]*?<\/tr>[\s\S]*?<\/thead>/i);
      const { name, nameAr } = splitNames(heading);
      const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((match) => match[0]);
      const data = {};

      rows.forEach((row) => {
        const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);
        if (cells.length < 2) return;
        const label = stripTags(cells[0]).toLowerCase();
        const value = cells.slice(1).join(" ");
        if (label.includes("téléphone") || label.includes("telephone")) data.phone = normalizePhone(stripTags(value));
        if (label.includes("quartier")) data.district = stripTags(value);
        if (label.includes("adresse")) data.address = stripTags(value);
        if (label.includes("localisation")) data.mapsUrl = firstMatch(value, /href=["']([^"']+)["']/i);
      });

      return {
        name,
        nameAr,
        phone: data.phone || "",
        district: data.district || "",
        districtAr: data.district?.match(/[\u0600-\u06ff][\u0600-\u06ff\s،]+/)?.[0]?.trim() || "",
        address: data.address || "",
        date: "",
        mapsUrl: data.mapsUrl || "",
      };
    })
    .filter((pharmacy) => pharmacy.name && (pharmacy.phone || pharmacy.address))
    .filter((pharmacy, index, items) => items.findIndex((item) => item.name === pharmacy.name) === index)
    .slice(0, 4);
};

const toTitleCase = (value = "") =>
  value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const englishPharmacyName = (name = "") => {
  const clean = name.trim().replace(/^pharmacie\s+/i, "");
  return clean ? `${toTitleCase(clean)} Pharmacy` : "On-duty Pharmacy";
};

const buildFallbackData = (data) => ({
  ...data,
  pharmacies: data.pharmacies.map((pharmacy) => ({
    ...pharmacy,
    nameEn: pharmacy.nameEn || englishPharmacyName(pharmacy.name),
    districtEn: pharmacy.districtEn || pharmacy.district,
    addressAr: pharmacy.addressAr || pharmacy.address,
    addressEn: pharmacy.addressEn || pharmacy.address,
  })),
});

const updateScriptFallback = async (data) => {
  const script = await readFile(SCRIPT, "utf8");
  const fallback = JSON.stringify(buildFallbackData(data), null, 2);
  const updated = script.replace(
    /const fallbackPharmacyData = \{[\s\S]*?\n\}\s*;\n\nconst getLocalized/,
    `const fallbackPharmacyData = ${fallback};\n\nconst getLocalized`
  );

  if (updated === script) {
    throw new Error("Unable to update fallbackPharmacyData in script.js");
  }

  await writeFile(SCRIPT, updated);
};

const run = async () => {
  const existing = JSON.parse(await readFile(OUTPUT, "utf8"));
  let html;
  let sourceUpdatedAt;

  try {
    const source = await fetchHtml();
    html = source.html;
    sourceUpdatedAt = source.updatedAt;
  } catch (error) {
    console.warn(`Pharmacy source temporarily unavailable, keeping current data: ${error.message}`);
    await updateScriptFallback(existing);
    return;
  }

  const pharmacies = parsePharmacies(html);
  const updatedAt =
    sourceUpdatedAt ||
    firstMatch(html, /property=["']article:modified_time["']\s+content=["']([^"']+)["']/i) ||
    new Date().toISOString();
  const readableDate =
    firstMatch(html, /pharmacie de garde kenitra\s+(\d{1,2}\s+et\s+\d{1,2}\s+\w+\s+\d{4})/i) ||
    firstMatch(html, /meta name=["']description["'] content=["'][^"']*?(\d{1,2}\s+\w+\s+\d{4})/i) ||
    new Intl.DateTimeFormat("fr-MA", { dateStyle: "full", timeZone: "Africa/Casablanca" }).format(new Date());

  if (!pharmacies.length) {
    throw new Error("No pharmacies could be parsed from the source page.");
  }

  const sourceTimestamp = Date.parse(updatedAt);
  const existingTimestamp = Date.parse(existing.updatedAt || "");
  if (Number.isFinite(sourceTimestamp) && Number.isFinite(existingTimestamp) && sourceTimestamp < existingTimestamp) {
    console.warn(`Source data is older than current data (${updatedAt} < ${existing.updatedAt}); keeping current list.`);
    await updateScriptFallback(existing);
    return;
  }

  const data = {
    source: SOURCE_URL,
    updatedAt,
    title: `Pharmacies de garde Kenitra - ${readableDate}`,
    image: "assets/pharmacies/pharmacie-garde-kenitra.jpg",
    updateFrequency: "automatic-4-times-per-day-data-weekly-manual-image",
    note:
      "Données texte actualisées automatiquement 4 fois par jour depuis pharmaciedegardekenitra.com. Les pharmacies ouvrent généralement de 9h à 13h puis de 16h à 20h. La pharmacie de garde reste ouverte 24h/24 à partir de 9h du matin. L'affiche image reste mise à jour manuellement une fois par semaine. Appelez la pharmacie avant de vous déplacer.",
    pharmacies: pharmacies.map((pharmacy) => ({ ...pharmacy, date: readableDate })),
  };

  await writeFile(OUTPUT, `${JSON.stringify(data, null, 2)}\n`);
  await updateScriptFallback(data);
  console.log(`Updated ${pharmacies.length} pharmacies from ${SOURCE_URL}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
