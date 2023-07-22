import electron from "electron";
import * as electronFs from "fs";
import * as electronOs from "os";
import sqlite3 from "sqlite3";

const { ipcRenderer } = electron;

// Note - This file is important, to ensure none of the non-imported modules are ignored
// Particularly, sqlite3 module isn't imported directly anywhere, but is required by Sequelize
// Hence, need to use here

export const sqlite3Version = sqlite3.VERSION;

console.log("Renderer Dependencies:", {
  electron,
  electronFs,
  electronOs,
  ipcRenderer,
  platform: electronOs.platform(),
  // remote,
  sqlite3,
  sqlite3Version,
  // remoteMain,
});

export function logDependenciesOnError() {
  console.log("Test deps -----------------");
  const { ipcRenderer } = electron;
  console.log("Electron", {
    electron,
    electronFs,
    electronOs,
    ipcRenderer,
    platform: electronOs.platform(),
  });

  console.log("Sqlite", {
    sqlite3,
    sqlite3Version: sqlite3.VERSION,
  });

  console.log("---------------------------");
}

// // Debugging for native modules
// const electronDialog = electron.dialog;
// console.log('electron.dialog', electronDialog);
// const sqlite3Window = window.require('sqlite3');
// console.log("Sqlite 3 required", sqlite3Window);
// console.log("Sqlite 3 imported === required", sqlite3Window === sqlite3);
