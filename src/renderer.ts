/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { ipcRenderer, webFrame } from 'electron';
import { renderReactApp } from './reactApp';

import './index.css';
import './colors.css';
import { GENERAL_ACTIONS } from './constants/IpcConnection';

// Setup general actions
ipcRenderer.on(GENERAL_ACTIONS.ZOOM_IN, () => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() + 0.5);
});
ipcRenderer.on(GENERAL_ACTIONS.ZOOM_OUT, () => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() - 0.5);
});
ipcRenderer.on(GENERAL_ACTIONS.ZOOM_RESET, () => {
  webFrame.setZoomLevel(0);
});


renderReactApp();