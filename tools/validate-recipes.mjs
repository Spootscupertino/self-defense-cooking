import Ajv from 'ajv';
import fg from 'fast-glob';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function main() {
  const schemaPath = path.join(root, 'schemas', 'recipe.schema.json');
  const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  const files = await fg('recipes/*/recipe.json', { cwd: root });
  let exitCode = 0;

  for (const rel of files.sort()) {
    const full = path.join(root, rel);
    const data = JSON.parse(await fs.readFile(full, 'utf8'));
    const valid = validate(data);

    if (!valid) {
      exitCode = 1;
      console.error(`\n❌ ${rel}`);
      for (const err of validate.errors || []) {
        console.error(`  ${err.instancePath} ${err.message}`);
      }
    }
  }

  if (exitCode === 0) {
    console.log('✅ All recipes validated');
  } else {
    console.error('\nValidation failed');
  }

  process.exit(exitCode);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
