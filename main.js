const { app, BrowserWindow } = require("electron");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");

let win;
let isHidden = false;

const argv = yargs(hideBin(process.argv))
  .option("preload", {
    alias: "p",
    type: "string",
    description: "Path to preload script",
  })
  .option("url", {
    alias: "u",
    type: "string",
    description: "URL to load",
  })
  .option("width", { type: "number" })
  .option("height", { type: "number" })
  .option("hidden_handle", { type: "string" }).argv;

if (!argv.preload || !argv.url) {
  console.error("Error: Please provide a preload script and a URL");
  process.exit(1);
}

function createWindow() {
  win = new BrowserWindow({
    width: argv.width || 800,
    height: argv.height || 600,
    transparent: true,
    webPreferences: {
      preload: argv.preload,
    },
  });

  win.removeMenu();
  win.loadURL(argv.url);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
if (argv.hidden_handle) {
  fs.watch(argv.hidden_handle, (eventType, filename) => {
    console.log("hi");
    if (eventType === "change") {
      if (isHidden) {
        win.webContents.executeJavaScript(
          "document.body.style.display = 'none'"
        );
        isHidden = false;
      } else {
        win.webContents.executeJavaScript(
          "document.body.style.display = 'block'"
        );
        isHidden = true;
      }
    }
  });
}
