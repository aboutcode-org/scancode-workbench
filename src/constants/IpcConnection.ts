export const OPEN_ERROR_DIALOG_CHANNEL = "open-error-dialog";
export interface ErrorInfo {
  title: string;
  message: string;
}

export const OPEN_DIALOG_CHANNEL = {
  JSON: 'open-json-file',
  SQLITE_PATH_FOR_JSON: 'choose-sqlite-path-for-json-file',
  SQLITE: 'open-sqlite-file',
  SAVE_SQLITE: 'save-sqlite-file',
}

export const IMPORT_REPLY_CHANNEL = {
  JSON: 'import-json-reply',
  SQLITE: 'import-sqlite-reply',
}

export const SAVE_REPLY_CHANNEL = {
  SQLITE: 'save-sqlite-reply',
}

export const UTIL_CHANNEL = {
  SET_CURRENT_FILE_TITLE: 'set-current-file-title',
}

export const NAVIGATION_CHANNEL = 'NAVIGATE_TO';
export type NAVIGATION_CHANNEL_MESSAGE = string;

export const GENERAL_ACTIONS = {
  ZOOM_IN: 'zoom_in',
  ZOOM_OUT: 'zoom_out',
  ZOOM_RESET: 'zoom_reset',
}

export interface SQLITE_PATH_FOR_JSON_REQUEST_FORMAT {
  jsonFilePath: string;
}
export interface JSON_IMPORT_REPLY_FORMAT {
  jsonFilePath: string;
  sqliteFilePath: string;
}
export interface SQLITE_IMPORT_REPLY_FORMAT {
  sqliteFilePath: string;
}
export interface SQLITE_SAVE_REPLY_FORMAT {
  sqliteFilePath: string;
}