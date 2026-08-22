import { readFile, readdir, stat } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

const distDir = resolve(process.argv[2] ?? 'dist');
const entryBudgetBytes = 400_000;
const routeChunkBudgetBytes = 500_000;

const html = await readFile(join(distDir, 'index.html'), 'utf8');
const entryMatch = html.match(/<script[^>]+type="module"[^>]+src="([^"]+\.js)"/);
if (!entryMatch) {
  throw new Error('BUNDLE_BUDGET_FAIL|unable to identify the module entry in dist/index.html');
}

const entryPath = join(distDir, entryMatch[1].replace(/^\//, ''));
const entryBytes = (await stat(entryPath)).size;
const assetNames = await readdir(join(distDir, 'assets'));
const jsAssets = assetNames.filter((name) => name.endsWith('.js'));
const assetSizes = await Promise.all(jsAssets.map(async (name) => ({
  name,
  bytes: (await stat(join(distDir, 'assets', name))).size,
})));
const largestRouteChunk = assetSizes.reduce(
  (largest, asset) => (asset.bytes > largest.bytes ? asset : largest),
  { name: 'none', bytes: 0 },
);

console.log(`BUNDLE_BUDGET_PASS|entry=${basename(entryPath)}|bytes=${entryBytes}|entry_budget=${entryBudgetBytes}`);
console.log(`BUNDLE_CHUNK_BASELINE|largest=${largestRouteChunk.name}|bytes=${largestRouteChunk.bytes}|chunk_budget=${routeChunkBudgetBytes}`);

if (entryBytes > entryBudgetBytes) {
  throw new Error(`BUNDLE_BUDGET_FAIL|entry ${entryBytes} exceeds ${entryBudgetBytes} bytes`);
}

if (largestRouteChunk.bytes > routeChunkBudgetBytes) {
  throw new Error(`BUNDLE_BUDGET_FAIL|chunk ${largestRouteChunk.name} is ${largestRouteChunk.bytes} bytes, exceeds ${routeChunkBudgetBytes} bytes`);
}
