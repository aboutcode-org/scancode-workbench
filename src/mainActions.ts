import * as electronOs from "os"
import { ipcMain, dialog, BrowserWindow } from 'electron';

import {
  ErrorInfo,
  OPEN_DIALOG_CHANNEL,
  OPEN_ERROR_DIALOG_CHANNEL,
  IMPORT_REPLY_CHANNEL,
  SAVE_REPLY_CHANNEL, 
  JSON_IMPORT_REPLY_FORMAT,
  SQLITE_IMPORT_REPLY_FORMAT,
  SQLITE_SAVE_REPLY_FORMAT,
  SQLITE_PATH_FOR_JSON_REQUEST_FORMAT,
  UTIL_CHANNEL,
} from './constants/IpcConnection';

export function chooseSqlitePathForJsonImport(mainWindow: BrowserWindow, jsonFilePath: string){
  console.log("Prompt to choose Sqlite path for JSON file");

  let defaultPath;
  if (electronOs.platform() === 'linux') {
    // remove the .json (or other) extention of the path.
    defaultPath = jsonFilePath.substring(0, jsonFilePath.lastIndexOf('.')) + '.sqlite';
  } else {
    // FIXME: this is some ugly regex used to get filename with no extension.
    // see: https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript
    defaultPath = jsonFilePath.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
  }

  // Immediately ask for a path to create & save the SQLite database
  dialog.showSaveDialog(mainWindow, {
    title: 'Save a SQLite Database File',
    defaultPath: defaultPath,
    filters: [{
      name: 'SQLite File',
      extensions: ['sqlite']
    }]
  }).then((sqliteFile) => {
    const sqliteFilePath = sqliteFile.filePath;
    if (sqliteFilePath === undefined) {
      console.log("Sqlite file path isn't valid:", sqliteFilePath);
      return;
    }
    const reply: JSON_IMPORT_REPLY_FORMAT = {
      jsonFilePath,
      sqliteFilePath
    }
    mainWindow.webContents.send(IMPORT_REPLY_CHANNEL.JSON, reply);
  });
}

export function importJsonFile(mainWindow: BrowserWindow){
  console.log("Prompt to Import JSON file");
  dialog.showOpenDialog(mainWindow, {    
    title: 'Open a JSON File',
    filters: [{
        name: 'JSON File',
        extensions: ['json']
    }]
    }).then(({filePaths}) => {
      if (filePaths === undefined || !filePaths[0]) {
        return;
      }
      chooseSqlitePathForJsonImport(mainWindow, filePaths[0]);
    });
}

export function openSqliteFile(mainWindow: BrowserWindow){
  console.log("Prompt to open SQLite file");

  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Open a SQLite File',
    filters: [{
      name: 'SQLite File',
      extensions: ['sqlite']
    }]
  }).then(({ filePaths }) => {
    if (filePaths && filePaths[0]) {
      const sqliteFilePath = filePaths[0]
      const reply: SQLITE_IMPORT_REPLY_FORMAT = { sqliteFilePath };
      mainWindow.webContents.send(IMPORT_REPLY_CHANNEL.SQLITE, reply);
    } else {
      console.log("Sqlite file path isn't valid:", filePaths);
      return;
    }
  });
}

export function saveSqliteFile(mainWindow: BrowserWindow){
  console.log("Save sqlite file prompt");

  dialog.showSaveDialog(mainWindow, {
    title: 'Save as a Database File',
    defaultPath: 'fileName.sqlite',
    filters: [
      { name: 'SQLite File', extensions: ['sqlite'] }
    ]
  }).then((file) => {
    const sqliteFilePath = file?.filePath;
    if (sqliteFilePath) {
      const reply: SQLITE_SAVE_REPLY_FORMAT = { sqliteFilePath };
      mainWindow.webContents.send(SAVE_REPLY_CHANNEL.SQLITE, reply);
    } else {
      console.log("Sqlite file path isn't valid:", file, sqliteFilePath);
      return;
    }
  });
}

export function showErrorDialog(err: ErrorInfo){
  console.log("Showing error to user:", err)
  dialog.showErrorBox(
    err.title,
    err.message
  );
}

export function setCurrentFileTitle(mainWindow: BrowserWindow, title: string){
  if(!mainWindow){
    console.log("Main window not found:", title, mainWindow);
    return;
  }
  const titleString = "Scancode Workbench" + (title ? ` - ${title}` : "");
  mainWindow.setTitle(titleString);
}

export function setUpGlobalIpcListeners(){
  const getCurrentWindow = () => BrowserWindow.getFocusedWindow();
  ipcMain.on(OPEN_DIALOG_CHANNEL.JSON, () => importJsonFile(getCurrentWindow()));
  ipcMain.on(
    OPEN_DIALOG_CHANNEL.SQLITE_PATH_FOR_JSON,
    (_, message: SQLITE_PATH_FOR_JSON_REQUEST_FORMAT) => 
      chooseSqlitePathForJsonImport(getCurrentWindow(), message.jsonFilePath)
  );
  ipcMain.on(OPEN_DIALOG_CHANNEL.SQLITE, () => openSqliteFile(getCurrentWindow()));
  ipcMain.on(OPEN_DIALOG_CHANNEL.SAVE_SQLITE, () => saveSqliteFile(getCurrentWindow()));
  ipcMain.on(UTIL_CHANNEL.SET_CURRENT_FILE_TITLE, (_, title: string) => setCurrentFileTitle(getCurrentWindow(), title));
  ipcMain.on(OPEN_ERROR_DIALOG_CHANNEL, (_, err: ErrorInfo) => showErrorDialog(err));
}

export function setUpWindowListeners(mainWindow: BrowserWindow){
  mainWindow.on('ready-to-show', () => setCurrentFileTitle(mainWindow, ""));
}