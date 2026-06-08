import { writeFile } from "node:fs/promises";

const SOURCE_URL = "https://pharmaciedegardekenitra.com/";
const OUTPUT = new URL("../data/pharmacies-garde.json", import.meta.url);

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

const fetchHtml = async () => {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "user-agent": "Medomicile pharmacy updater (+https://medomicile.com/)",
    },
  });

  if (!response.ok) throw new Error(`Source unavailable: ${response.status}`);
  return response.text();
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

const run = async () => {
  const html = await fetchHtml();
  const pharmacies = parsePharmacies(html);
  const updatedAt =
    firstMatch(html, /property=["']article:modified_time["']\s+content=["']([^"']+)["']/i) ||
    new Date().toISOString();
  const readableDate =
    firstMatch(html, /pharmacie de garde kenitra\s+(\d{1,2}\s+et\s+\d{1,2}\s+\w+\s+\d{4})/i) ||
    firstMatch(html, /meta name=["']description["'] content=["'][^"']*?(\d{1,2}\s+\w+\s+\d{4})/i) ||
    new Intl.DateTimeFormat("fr-MA", { dateStyle: "full", timeZone: "Africa/Casablanca" }).format(new Date());

  if (!pharmacies.length) {
    throw new Error("No pharmacies could be parsed from the source page.");
  }

  const data = {
    source: SOURCE_URL,
    updatedAt,
    title: `Pharmacies de garde Kenitra - ${readableDate}`,
    image: "assets/pharmacies/pharmacie-garde-kenitra.jpg",
    updateFrequency: "automatic-4-times-per-day-data-weekly-manual-image",
    note:
      "Données texte actualisées automatiquement 4 fois par jour depuis pharmaciedegardekenitra.com. L'affiche image reste mise à jour manuellement une fois par semaine. Appelez la pharmacie avant de vous déplacer.",
    pharmacies: pharmacies.map((pharmacy) => ({ ...pharmacy, date: readableDate })),
  };

  await writeFile(OUTPUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${pharmacies.length} pharmacies from ${SOURCE_URL}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
