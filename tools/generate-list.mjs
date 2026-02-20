import fg from 'fast-glob';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function main() {
  const files = await fg('recipes/*/recipe.json', { cwd: root });
  const list = [];

  for (const rel of files.sort()) {
    const full = path.join(root, rel);
    const data = JSON.parse(await fs.readFile(full, 'utf8'));
    const slug = data.slug || path.basename(path.dirname(rel));
    const title = data.title || slug;

    if (!slug || !title) continue;

    const entry = { slug, title };
    if (Array.isArray(data.tags) && data.tags.length) entry.tags = data.tags;
    if (Array.isArray(data.categories) && data.categories.length) entry.categories = data.categories;
    if (Array.isArray(data.keywords) && data.keywords.length) entry.keywords = data.keywords;

    list.push(entry);
  }

  const outPath = path.join(root, 'recipes', 'list.json');
  await fs.writeFile(outPath, JSON.stringify(list, null, 2) + '\n');
  console.log(`Wrote ${list.length} entries to ${path.relative(root, outPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
