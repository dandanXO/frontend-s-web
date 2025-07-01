const fs = require("fs");
const path = require("path");

const imageDir = path.resolve(__dirname, "../src/assets/");

// Add your desired extensions here
const allowedExtensions = [".png", ".jpeg", ".jpg"];

function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllImageFiles(fullPath, fileList);
    } else if (allowedExtensions.includes(path.extname(file).toLowerCase())) {
      fileList.push({
        path: fullPath.replace(imageDir + path.sep, ""),
        size: stat.size,
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

const imageFiles = getAllImageFiles(imageDir);
imageFiles.sort((a, b) => b.size - a.size);

// Step 2: Take the top 100 largest files
const top100BySize = imageFiles.slice(0, 100);

// Step 3: Sort the top 100 by file name (alphabetically)
top100BySize.sort((a, b) => a.path.localeCompare(b.path));

// Step 4: Output
console.log(`\n🗂️ Top 100 Largest Image Files in ${imageDir} (Sorted by Name):\n`);
top100BySize.forEach((file, index) => {
  console.log(`${index + 1}. ${file.path} - ${formatSize(file.size)}`);
});

// console.log(`\n🗂️ Files in ${imageDir} (Top 100 sorted by size):\n`);
// imageFiles.forEach((file, index) => {
//   if (index < 100) {
//     console.log(`${index + 1}. ${file.path} - ${formatSize(file.size)}`);
//   }
// });
