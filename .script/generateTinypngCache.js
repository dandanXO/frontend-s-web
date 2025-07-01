const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const glob = require('glob');

const ROOT_DIR = process.cwd();

const CACHE_PATH = path.join(__dirname, 'data/tinypng-cache.json');

const IMAGE_GLOB = '**/*.+(png|jpg|jpeg)';

function hashFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

function createCache() {
  const files = glob.sync(IMAGE_GLOB, {
    cwd: ROOT_DIR,
    nodir: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
  });

  const cache = {};
  for (const file of files) {
    const absPath = path.join(ROOT_DIR, file);
    const hash = hashFile(absPath);
    cache[file] = hash;
    console.log(`Cached: ${file} -> ${hash}`);

  }

  fs.writeJsonSync(CACHE_PATH, cache, { spaces: 2 });
  console.log(`Cache created at ${CACHE_PATH}`);

}

createCache();