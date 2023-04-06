import { GENERAL_ACTIONS, NAVIGATION_CHANNEL } from './constants/IpcConnection';
import packageJson from '../package.json';
import { app, BrowserWindow, MenuItem, shell } from 'electron';
import { importJsonFile, openSqliteFile, saveSqliteFile } from './mainActions';
import { ROUTES } from './constants/routes';
import { createWindow } from './main';

/** Returns a 'lambda' that sends the event to the renderer process. */
export function sendNavEventToRenderer(route: string) {
  return (_: MenuItem, currentWindow: BrowserWindow) => 
    currentWindow.webContents.send(NAVIGATION_CHANNEL, route);
}
export function sendEventToRenderer(eventKey: string, ...args: unknown[]) {
  return (_: MenuItem, currentWindow: BrowserWindow) => 
    currentWindow.webContents.send(eventKey, args);
}

/** Returns a template for building the main electron menu */
function getTemplate() {
  const isMac = process.platform === 'darwin'

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '&File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow(),
        },
        {
          label: 'Open SQLite File',
          accelerator: 'CmdOrCtrl+O',
          click: (_: MenuItem, currentWindow: BrowserWindow) => openSqliteFile(currentWindow),
        },
        {
          label: 'Save As New SQLite File',
          accelerator: 'CmdOrCtrl+S',
          click: (_: MenuItem, currentWindow: BrowserWindow) => saveSqliteFile(currentWindow),
        },
        {
          label: 'Import JSON File',
          accelerator: 'CmdOrCtrl+I',
          click: (_: MenuItem, currentWindow: BrowserWindow) => importJsonFile(currentWindow),
        },
        // @TODO-discuss This is duplicated in App's menu tab, is it necessary under file tab also ??
        // ...(
        //   isMac ? [
        //     {
        //       label: 'Quit',
        //       accelerator: 'CmdOrCtrl+Q',
        //       click: () => app.quit()
        //     }
        //   ] : []
        // )
      ]
    },
    {
      label: '&Edit',
      submenu: [
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        },
      ]
    },
    {
      label: '&View',
      submenu: [
        {
          label: 'Table View',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: sendNavEventToRenderer(ROUTES.TABLE_VIEW),
        },
        {
          label: 'Chart Summary View',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: sendNavEventToRenderer(ROUTES.CHART_SUMMARY),
        },
        {
          type: 'separator'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (_: MenuItem, focusedWindow: BrowserWindow) => {
            if(focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: isMac ? 'Ctrl+Command+F' : 'F11',
          click: (item: MenuItem, focusedWindow: BrowserWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(
                !focusedWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Alt+I',
          click: (item: MenuItem, focusedWindow: BrowserWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: sendEventToRenderer(GENERAL_ACTIONS.ZOOM_RESET)
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: sendEventToRenderer(GENERAL_ACTIONS.ZOOM_IN)
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: sendEventToRenderer(GENERAL_ACTIONS.ZOOM_OUT)
        },
      ]
    },
    {
      label: '&Window',
      role: 'window',
      type: 'submenu',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        ...(
          isMac ? [
            // {
            //   type: 'separator',
            //   role: 'separator',
            // },
            // {
            //   label: 'Bring All to Front',
            //   role: 'quit',
            //   accelerator: '',
            // },
          ]  : []
        )
      ]
    },
    {
      label: '&Help',
      role: 'help',
      submenu: [
        {
          label: `ScanCode Workbench Version ${packageJson.version}`,
          enabled: false
        },
        {
          label: 'Show ScanCode Header Information',
          accelerator: 'CmdOrCtrl+G',
          click: sendNavEventToRenderer(ROUTES.SCAN_INFO),
        },
        {
          type: 'separator'
        },
        {
          label: 'GitHub Repository',
          click: () => shell.openExternal('https://github.com/nexB/scancode-workbench/')
        },
        {
          label: 'Licensing Information',
          // // @TODO
          // click: () => showErrorDialog({
          //   title: "Not implemented",
          //   message: "This feature is yet to be discussed"
          // })
          click: () => {
          // @TODO - make react route instead
            let win = new BrowserWindow({frame: true});
            win.setMenu(null);
            win.on('closed', ():void => win = null);
            win.loadFile('./attribution.html');
            // win.loadURL('file://' + __dirname + '/attribution.html');
            win.show();
          }
        },
        {
          label: 'Documentation',
          click: () => shell.openExternal(`https://scancode-workbench.readthedocs.io`)
        },
        {
          label: 'Issue Tracker',
          click: () => shell.openExternal('https://github.com/nexB/scancode-workbench/issues')
        }
      ]
    },
  ];

  // Mac OS specific menu item for app 
  if (isMac) {
    template.unshift({
      label: 'ScanCode Workbench',
      submenu: [
        {
          label: 'About ScanCode Workbench',
          click: sendNavEventToRenderer(ROUTES.ABOUT),
        },
        {
          label: `Version ${packageJson.version}`,
          enabled: false
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          accelerator: '',
        },
        {
          type: 'separator',
        },
        {
          label: 'Hide Electron',
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideOthers',
        },
        {
          label: 'Show All',
          role: 'unhide',
          accelerator: '',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit(),
        },
      ]
    })
  }

  return template;
}

export default getTemplate;