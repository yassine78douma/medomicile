import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const configPath = path.join(root, "data", "medical-specialties.json");
const pages = [
  { lang: "fr", file: "medecins-kenitra.html" },
  { lang: "en", file: "medecins-kenitra-en.html" },
  { lang: "ar", file: "medecins-kenitra-ar.html" }
];

const checkOnly = process.argv.includes("--check");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const metadataByHref = new Map();

for (const item of config.specialties) {
  for (const href of Object.values(item.href || {})) {
    metadataByHref.set(href, item);
  }
}

function sortCards(cards) {
  return [...cards].sort((left, right) => {
    const leftMeta = metadataByHref.get(left.href);
    const rightMeta = metadataByHref.get(right.href);
    const leftAvailable = leftMeta?.available === true ? 0 : 1;
    const rightAvailable = rightMeta?.available === true ? 0 : 1;

    if (leftAvailable !== rightAvailable) return leftAvailable - rightAvailable;
    return (leftMeta?.order ?? 9999) - (rightMeta?.order ?? 9999);
  });
}

function parseCards(grid) {
  const cardPattern = /(\n\s*<a class="specialty-card reveal" href="([^"]+)">[\s\S]*?\n\s*<\/a>)/g;
  const cards = [];
  let match;
  while ((match = cardPattern.exec(grid)) !== null) {
    cards.push({ html: match[1], href: match[2] });
  }
  return cards;
}

let changed = false;

for (const page of pages) {
  const filePath = path.join(root, page.file);
  const html = fs.readFileSync(filePath, "utf8");
  const gridPattern = /(<div class="specialty-grid">)([\s\S]*?)(\n\s*<\/div>\s*\n\s*<\/section>)/;
  const match = html.match(gridPattern);
  if (!match) {
    throw new Error(`Specialty grid introuvable dans ${page.file}`);
  }

  const cards = parseCards(match[2]);
  if (!cards.length) {
    throw new Error(`Aucune carte spécialité trouvée dans ${page.file}`);
  }

  const sorted = sortCards(cards);
  const alreadySorted = cards.every((card, index) => card.href === sorted[index].href);
  if (alreadySorted) continue;

  const nextGrid = sorted.map((card) => card.html).join("\n");
  const nextHtml = html.replace(gridPattern, `${match[1]}${nextGrid}${match[3]}`);

  if (nextHtml !== html) {
    changed = true;
    if (!checkOnly) {
      fs.writeFileSync(filePath, nextHtml, "utf8");
    }
  }
}

if (checkOnly && changed) {
  throw new Error("L'ordre des spécialités n'est pas synchronisé avec data/medical-specialties.json");
}

console.log(changed ? "Specialty pages sorted." : "Specialty pages already sorted.");
