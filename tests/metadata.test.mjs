import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

test('release metadata conforms to the shared version 2 contract', async () => {
  const schema = JSON.parse(await readFile(new URL('../contracts/visual-template-v2.schema.json', import.meta.url)));
  const metadata = JSON.parse(await readFile(new URL('../public/metadata.json', import.meta.url)));
  const packageInfo = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  assert.equal(ajv.validate(schema, metadata), true, ajv.errorsText());
  assert.equal(metadata.version, packageInfo.version);
  assert.equal(metadata.game.internalName, 'generic');
  assert.equal(metadata.name.some((item) => item.language === 'jp'), false);
});
