import electron from "electron";
import * as electronFs from "fs";
import * as electronOs from "os";
import sqlite3 from "sqlite3";

// Note - This file is important, to ensure none of the non-imported modules are ignored
// Particularly, sqlite3 module isn't imported directly anywhere, but is required by Sequelize
// Hence, need to use here

export const sqlite3Version = sqlite3.VERSION;

const RequiredRendererDependencies = {
  electron,
  electronFs,
  electronOs,
  ipcRenderer: electron?.ipcRenderer,
  platform: electronOs?.platform,
  sqlite3,
  sqlite3Version,
};
// console.log("Renderer Dependencies:", RequiredRendererDependencies);
// console.log(
//   "Ensure Renderer Dependencies",
//   Object.entries(RequiredRendererDependencies).map(([key, value]) => ({
//     [key]: value ? "Available" : "Unavailable",
//   }))
// );

export function logDependenciesOnError() {
  console.log("Test deps -----------------");
  console.log(RequiredRendererDependencies);
  console.log("---------------------------");
}

// // Debugging for native modules
// const electronDialog = electron.dialog;
// console.log('electron.dialog', electronDialog);
// const sqlite3Window = window.require('sqlite3');
// console.log("Sqlite 3 required", sqlite3Window);
// console.log("Sqlite 3 imported === required", sqlite3Window === sqlite3);
