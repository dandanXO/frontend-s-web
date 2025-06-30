require("dotenv").config();
const path = require("path");
const fse = require("fs-extra");
const crypto = require("crypto");
const tinyfy = require("tinify");
const { execSync } = require("child_process");

const TINYPNG_API_KEY = process.env.TINYPNG_API_KEY;
const CACHE_PATH = path.join(__dirname, "data/tinypng-cache.json");

if (!TINYPNG_API_KEY) {
  console.error("TINYPNG_API_KEY is not set in the environment variables.");
  process.exit(1);
}

const cache = fse.existsSync(CACHE_PATH) ? fse.readJsonSync(CACHE_PATH) : {};
tinyfy.key = TINYPNG_API_KEY;

const hashFile = (filePath) => {
  const buffer = fse.readFileSync(filePath);
  return crypto.createHash("md5").update(buffer).digest("hex");
};

const compressImgs = async (filePath) => {
  const source = tinyfy.fromFile(filePath);
  await source.toFile(filePath);
  console.log(`Compressed: ${filePath}`);
};

const getDiffImgs = () => {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMRT", {
    encoding: "utf8",
  });
  const imgs = output
    .split("\n")
    .filter((file) => /\.(png|jpg|jpeg)$/i.test(file) && fse.existsSync(file));
  return imgs;
};

const getDeletedImgs = () => {
  const output = execSync("git diff --cached --name-status", {
    encoding: "utf8",
  });
  const deletedImages = output
    .split("\n")
    .map((line) => line.trim().split(/\s+/))
    .filter(
      ([status, filename]) =>
        status === "D" && /\.(png|jpg|jpeg)$/i.test(filename)
    )
    .map(([, filename]) => filename);
  return deletedImages
};

const main = async () => {
  const imgs = getDiffImgs();
  const deletedImgs = getDeletedImgs();

  if (imgs.length === 0 && deletedImgs.length === 0) {
    console.log("No image files to compress.");
    return;
  }

  console.log(`Found ${imgs.length} image(s) to compress`);

  let updated = false;
  let removed = false;

  for (const img of imgs) {
    console.log(`Processing ${img}...`);
    const hash = hashFile(img);
    if (cache[img] === hash) {
      console.log(`Skipping ${img}, already compressed.`);
      continue;
    }

    try {
      await compressImgs(img);
      cache[img] = hash;
      updated = true;
    } catch (err) {
      console.error(`Error compressing ${img}:`, err.message);
    }
  }

  for (const img of deletedImgs) {
    if (cache[img]) {
      delete cache[img];
      console.log(`Removed ${img} from cache.`);
      removed = true;
    }
  }

  if (updated || removed) {
    fse.writeJsonSync(CACHE_PATH, cache, { spaces: 2 });
    console.log("Cache updated.");
  }
};

main();
