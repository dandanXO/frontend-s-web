const fs = require("fs");
const path = require("path");

const imageDir = path.resolve(__dirname, "../src/assets/");

function getAllSvgFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllSvgFiles(fullPath, fileList);
    } else if (path.extname(file).toLowerCase() === ".jpg") {
      //Change .png .jpeg .gif .svg .jpg here.
      fileList.push({
        path: fullPath.replace(imageDir + path.sep, ""),
        size: stat.size
      });
    }
  });
  return fileList;
}

function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    ++i;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

const svgFiles = getAllSvgFiles(imageDir);
svgFiles.sort((a, b) => b.size - a.size);

console.log(`\n🗂️Files in ${imageDir} (Top 100 sorted by size):\n`);
svgFiles.forEach((file, index) => {
  if (index < 100) {
    console.log(`${index + 1}. ${file.path} - ${formatSize(file.size)}`);
  }
});
