const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const Menu = electron.Menu;
const packageJson = require('./package.json');
const path = require('path');

let mainWindow;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '/assets/app/app-icon/png/aboutcode_512x512.png')
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => mainWindow = null);
  // open all URLs in default browser window
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate()));
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

/** Returns a 'lambda' that sends the event to the renderer process. */
function sendEventToRenderer(event) {
  return (menuItem, currentWindow) => currentWindow.webContents.send(event);
}

/** Returns a template for building the main electron menu */
function getTemplate() {
  const template = [
    {
      label: '&File',
      submenu: [
        {
          label: 'Open SQLite File',
          accelerator: 'CmdOrCtrl+O',
          click: sendEventToRenderer('open-SQLite')
        },
        {
          label: 'Save As New SQLite File',
          accelerator: 'CmdOrCtrl+S',
          click: sendEventToRenderer('save-SQLite')
        },
        {
          label: 'Import JSON File',
          accelerator: 'CmdOrCtrl+I',
          click: sendEventToRenderer('import-JSON')
        },
        {
          label: 'Export JSON File',
          accelerator: 'CmdOrCtrl+E',
          click: sendEventToRenderer('export-JSON')
        },
        {
          label: 'Export Conclusions JSON File',
          accelerator: 'CmdOrCtrl+J',
          click: sendEventToRenderer('export-JSON-conclusions-only')
        }
      ]
    },
    {
      label: '&Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
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
          role: 'selectall'
        },
      ]
    },
    {
      label: '&View',
      submenu: [
        {
          label: 'Table View',
          accelerator: 'CmdOrCtrl+T',
          click: sendEventToRenderer('table-view')
        },
        {
          label: 'Chart Summary View',
          accelerator: 'Shift+CmdOrCtrl+D',
          click: sendEventToRenderer('chart-summary-view')
        },
        {
          label: 'Conclusion Summary View',
          accelerator: 'Shift+CmdOrCtrl+C',
          click: sendEventToRenderer('conclusion-summary-view')
        },
        {
          type: 'separator'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ?
            'Ctrl+Command+F' : 'F11',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(
                !focusedWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ?
            'Alt+Command+I' : 'Ctrl+Shift+I',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          }
        },
      ]
    },
    {
      label: '&Window',
      role: 'window',
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
      ]
    },
    {
      label: '&Help',
      role: 'help',
      submenu: [
        {
          label: `AboutCode Manager Version ${packageJson.version}`,
          enabled: false
        },
        {
          label: 'Get ScanCode Version and Options',
          accelerator: 'CmdOrCtrl+G',
          click: sendEventToRenderer('get-ScanInfo')
        },
        {
          type: 'separator'
        },
        {
          label: 'Learn More',
          click: () => shell.openExternal(
            'https://github.com/nexB/aboutcode-manager/wiki')
        },
        {
          label: 'Licensing Information',
          click: () => {
            let win = new BrowserWindow({frame: true});
            win.setMenu(null);
            win.on('closed', () => win = null);
            win.loadURL('file://' + __dirname + '/attribution.html');
            win.show();
          }
        },
        {
          label: 'Documentation',
          click: () => shell.openExternal(
            `https://github.com/nexB/aboutcode-manager/blob/v${packageJson.version}/README.md`)
        },
        {
          label: 'Search Issues',
          click: () => shell.openExternal(
            'https://github.com/nexB/aboutcode-manager/issues')
        }
      ]
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'AboutCode',
      submenu: [
        {
          label: 'About AboutCode Manager',
          click: () => {
            let win = new BrowserWindow({
              frame: true,
              width: 250,
              height: 200
            });
            win.on('closed', () => win = null);
            win.loadURL('file://' + __dirname + '/about.html');
            win.show();
          }
        },
        {
          type: 'separator'
        },
        {
          label: `Version ${packageJson.version}`,
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Electron',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        },
      ]
    });
    template[3].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );
  }

  const quitSubmenu =
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit()
    };

  if (process.platform !== 'darwin') {
    template[0].submenu.push(quitSubmenu);
  }
  return template;
}
