import { app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent, shell } from "electron";
// import { createRequire } from 'node:module'
import { fileURLToPath } from "node:url";
import path from "node:path";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { exec } from "node:child_process";
import log from "electron-log/main";

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");
const isWindows = process.platform === "win32";

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    title: "mobileconfig editor",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"), {
      hash: "/"
    });
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.handle("dialog:openFile", async () => {
  const result = await dialog.showOpenDialog(win!, {
    properties: ["openFile"],
    filters: [{ name: "PEM Files", extensions: ["pem"] }]
  });
  return result.filePaths;
});

ipcMain.handle("dialog:saveFile", async (_: IpcMainInvokeEvent, { title, fileName }: SaveFilePayload) => {
  const result = await dialog.showSaveDialog(win!, {
    title,
    defaultPath: fileName
  });
  return result;
});

ipcMain.handle("file:writeMobileconfig", async (_: IpcMainInvokeEvent, data: string) => {
  const appFolderPath = getAppDataPath();
  const filePath = path.join(appFolderPath, "unSign.mobileconfig");
  writeFileSync(filePath, data);
  return filePath;
});

ipcMain.handle("check:openssl", async () => {
  return new Promise((resolve, reject) => {
    const execScript = isWindows ? "where openssl" : "which openssl";
    exec(execScript, (error, stdout, stderr) => {
      if (error || stderr) {
        reject();
        return;
      }
      if (stdout) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
});

ipcMain.handle(
  "file:signBySsl",
  async (_: IpcMainInvokeEvent, publicKeyPath, privateKeyPath, mobileconfigFilePath, outputPath) => {
    log.info(1);
    return new Promise<void>((resolve, reject) => {
      try {
        const appFolderPath = getAppDataPath();
        const filePath = path.join(appFolderPath, "signed.mobileconfig");
        const execScript = `openssl smime -sign -in "${mobileconfigFilePath}" -out "${filePath}" -signer "${publicKeyPath}" -inkey "${privateKeyPath}" -certfile "${publicKeyPath}" -outform der -nodetach`;
        // log.info(execScript);
        exec(execScript, (error, _, stderr) => {
          if (error || stderr) {
            if (error) log.info(error);
            if (stderr) log.info(stderr);
            reject("fail");
            return;
          }
          const data = readFileSync(filePath);
          writeFileSync(outputPath, data);
          shell.showItemInFolder(outputPath);
          resolve();
        });
      } catch (e) {
        reject();
        log.info(e);
      }
    });
  }
);

const getAppDataPath = () => {
  const appDataPath = app.getPath("appData");
  const appFolderPath = path.join(appDataPath, "mobileconfig-editor");
  if (!existsSync(appFolderPath)) {
    mkdirSync(appFolderPath, { recursive: true });
  }
  return appFolderPath;
};

interface SaveFilePayload {
  fileName: string;
  title: string;
}
