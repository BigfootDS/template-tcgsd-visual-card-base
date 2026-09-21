import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateRelease, imageTags } from './release-metadata.mjs';

const input = (version = '2.0.0', tag = 'v' + version) => ({
  eventName: 'release', event: { action: 'published', release: { tag_name: tag, draft: false, prerelease: version.includes('-') } },
  version, lockVersion: version, rootLockVersion: version, repository: 'BigfootDS/Example',
});
test('stable release tags match package versions and only the designated latest release updates latest', () => {
  const release = validateRelease(input());
  assert.deepEqual(imageTags(release, 'v2.0.0'), ['ghcr.io/bigfootds/example:2.0.0', 'ghcr.io/bigfootds/example:latest']);
  assert.deepEqual(imageTags(release, 'v3.0.0'), ['ghcr.io/bigfootds/example:2.0.0']);
  assert.equal(validateRelease(input('2.0.0', '2.0.0')).version, '2.0.0');
});
test('prereleases never publish latest', () => {
  const release = validateRelease(input('2.1.0-rc.1'));
  assert.deepEqual(imageTags(release, 'v2.1.0-rc.1'), ['ghcr.io/bigfootds/example:2.1.0-rc.1']);
});
test('publishing rejects unrelated events, drafts, invalid tags and mismatched metadata', () => {
  for (const changes of [{ eventName: 'push' }, { version: '1.0.0' }, { lockVersion: '1.0.0' }, { rootLockVersion: undefined }, { templateVersion: '1.0.0' }]) assert.throws(() => validateRelease({ ...input(), ...changes }));
  for (const tag of ['latest', 'v01.0.0', 'v2.0.0+build', 'v2.0.0-01', 'v2.0.0\nimage=bad', 'v2.0.0;echo bad']) assert.throws(() => validateRelease(input('2.0.0', tag)));
  for (const changes of [{ draft: true }, { prerelease: true }, { tag_name: undefined }]) {
    const candidate = input(); Object.assign(candidate.event.release, changes);
    assert.throws(() => validateRelease(candidate));
  }
  const edited = input(); edited.event.action = 'edited';
  assert.throws(() => validateRelease(edited));
});
