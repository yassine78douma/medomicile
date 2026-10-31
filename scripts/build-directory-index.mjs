import { readFile, writeFile } from 'node:fs/promises';

const read = async (name) => JSON.parse(await readFile(new URL(`../data/${name}`, import.meta.url), 'utf8'));
const [establishments, pharmacies, laboratories, radiology] = await Promise.all([
  read('establishments.json'),
  read('pharmacies-kenitra.json'),
  read('laboratoires-kenitra.json'),
  read('radiology-centers.json'),
]);

const output = {
  version: new Date().toISOString().slice(0, 10),
  establishments: establishments.establishments || [],
  pharmacies: pharmacies.pharmacies || [],
  laboratories: laboratories.laboratories || [],
  centers: radiology.centers || [],
};

await writeFile(new URL('../data/directory-index.json', import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Built directory-index.json: ${output.establishments.length} establishments, ${output.pharmacies.length} pharmacies, ${output.laboratories.length} laboratories, ${output.centers.length} radiology centres.`);
