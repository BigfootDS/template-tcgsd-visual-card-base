import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('the visual template includes every generic card-editor field', async () => {
  const page = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const fields = [
    'game', 'containingSet', 'name', 'sortNumber', 'categories', 'types',
    'rarity', 'resourceTypes', 'resource1', 'resource2', 'resource3',
    'resource4', 'resource5', 'ruleboxes', 'ruleboxes.rule', 'actions',
    'actions.description', 'actions.damage', 'actions.costs.resourceType',
    'actions.costs.quantity', 'flavourText',
  ];
  for (const field of fields) assert.match(page, new RegExp(`tcgsd:${field.replaceAll('.', '\\.')}`));
});
