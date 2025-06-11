const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(__dirname, "../dist/spa");
const targetDir = path.resolve(__dirname, "../dist/live-chat");

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// 1. 复制 dist
copyRecursiveSync(sourceDir, targetDir);

// 2. 替换 index.html 中的 base href 与资源路径
const indexPath = path.join(targetDir, "index.html");
let html = fs.readFileSync(indexPath, "utf-8");

// 替换 base href
html = html.replace(/<base\s+href\s*=\s*["']?\/["']?\s*>/i, '<base href=/live-chat/ >');

// 替换所有 src="/..." 和 href="/..."，只限 js/css/png/ico 等静态资源
html = html.replace(
  /(src|href)=([\"\']?)\/(js|css|icons|statics|img|images|favicon)(\/.*?\.(js|css|png|jpg|jpeg|ico|svg|webp))\2?/g,
  "$1=$2/live-chat/$3$4$2"
);

fs.writeFileSync(indexPath, html);

const finalTargetDir = path.resolve(__dirname, "../dist/spa/live-chat");

// 防止无限复制：先删掉旧的 live-chat
if (fs.existsSync(finalTargetDir)) {
  fs.rmSync(finalTargetDir, { recursive: true, force: true });
}

// 将修改后的 live-chat 拷贝到 dist/spa/live-chat/
copyRecursiveSync(targetDir, finalTargetDir);

console.log("✅ Final copy done: /dist/live-chat → /dist/spa/live-chat/");


// 目标目录
const targetDir2 = path.resolve(__dirname, "../dist/spa/live-chat/js");

// 获取目录下的所有 app.xxxx.js 文件
const files = fs.readdirSync(targetDir2).filter(file =>
  file.startsWith('app.') && file.endsWith('.js')
);

if (files.length === 0) {
  console.log('未找到 app.xxxx.js 文件');
  process.exit(0);
}

files.forEach(file => {
  const filePath = path.join(targetDir2, file);

  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');

    // 替换路径
    content = content.replace(/js\//g, 'live-chat/js/');
    content = content.replace(/css\//g, 'live-chat/css/');

    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已更新文件: ${file}`);
  } catch (err) {
    console.error(`处理文件 ${file} 时出错:`, err);
  }
});

console.log('所有文件处理完成');


// 5. 清理临时目录
fs.rmSync(targetDir, { recursive: true, force: true });
console.log("🧹 Cleaned up /dist/live-chat (temporary folder removed)");

console.log("🎉 All done!");
