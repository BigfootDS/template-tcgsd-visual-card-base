import { appendFileSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Rejects release/version mismatches before any registry or release asset is written. */
export function validateRelease({ eventName, event, version, lockVersion, rootLockVersion, templateVersion, repository }) {
  if (eventName !== 'release' || event?.action !== 'published' || event.release?.draft !== false) throw new Error('Publishing requires a published GitHub Release.');
  const tag = event.release.tag_name;
  const match = typeof tag === 'string' && tag.match(/^v?((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?)$/);
  if (!match || match[1].length > 100 || match[2]?.split('.').some(part => /^\d+$/.test(part) && part.length > 1 && part.startsWith('0'))) throw new Error('Use a SemVer release tag, optionally prefixed with v, without build metadata.');
  if ([version, lockVersion, rootLockVersion].some(value => value !== match[1]) || (templateVersion !== undefined && templateVersion !== match[1])) throw new Error('Release tag, package.json, package-lock.json and template metadata versions must match.');
  if (event.release.prerelease !== Boolean(match[2])) throw new Error('The GitHub prerelease flag must match the version suffix.');
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('Invalid repository name.');
  return { tag, version: match[1], prerelease: Boolean(match[2]), image: 'ghcr.io/' + repository.toLowerCase() };
}

export function imageTags(release, latestTag) {
  const tags = [release.image + ':' + release.version];
  if (!release.prerelease && release.tag === latestTag) tags.push(release.image + ':latest');
  return tags;
}

async function main() {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const template = existsSync('public/metadata.json') ? JSON.parse(readFileSync('public/metadata.json', 'utf8')) : undefined;
  const release = validateRelease({ eventName: process.env.GITHUB_EVENT_NAME, event, version: pkg.version, lockVersion: lock.version, rootLockVersion: lock.packages?.['']?.version, templateVersion: template?.version, repository: process.env.GITHUB_REPOSITORY });
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  if (git('rev-parse', 'HEAD') !== process.env.GITHUB_SHA) throw new Error('The checkout differs from the release event commit.');
  git('merge-base', '--is-ancestor', 'HEAD', 'origin/main');
  let latestTag;
  if (!release.prerelease) {
    const response = await fetch((process.env.GITHUB_API_URL || 'https://api.github.com') + '/repos/' + process.env.GITHUB_REPOSITORY + '/releases/latest', {
      headers: { Authorization: 'Bearer ' + process.env.GH_TOKEN, Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status !== 404 && !response.ok) throw new Error('Could not establish the latest release; refusing to publish.');
    if (response.ok) latestTag = (await response.json()).tag_name;
  }
  appendFileSync(process.env.GITHUB_OUTPUT, 'version=' + release.version + '\nimage=' + release.image + '\ntags<<RELEASE_TAGS\n' + imageTags(release, latestTag).join('\n') + '\nRELEASE_TAGS\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
