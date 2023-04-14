import electron from 'electron'
import * as electronFs from "fs"
import * as electronOs from "os"
import sqlite3 from 'sqlite3';
const { ipcRenderer } = electron;

// Note - This file is important, to ensure none of the non-imported modules are ignored
// Particularly, sqlite3 module isn't imported directly anywhere, but is required by Sequelize
// Hence, need to use here

export const sqlite3Version = sqlite3.VERSION;

console.log("Renderer Deps:", {
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