'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const Menu  = electron.Menu;


let mainWindow;

function createWindow () {
  var path = require('path')

  mainWindow = new BrowserWindow({width: 1200, height: 800, icon: path.join(__dirname, '/assets/app-icon/png/aboutcode_512x512.png')});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  const menu = Menu.buildFromTemplate(getTemplate());
  Menu.setApplicationMenu(menu);
});
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

function getTemplate() {
  const template = [
    {
      label: '&File',
      submenu: [
        {
          label: "Open SQLite File",
          accelerator: 'CmdOrCtrl+O',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('open-SQLite')
          }
        },
        {
          label: "Save SQLite File",
          accelerator: 'CmdOrCtrl+S',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('save-SQLite')
          }
        },
        {
          label: "Import JSON File",
          accelerator: 'CmdOrCtrl+I',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('import-JSON')
          }
        },
        {
          label: "Export JSON File",
          accelerator: 'CmdOrCtrl+E',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('export-JSON')
          }
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
          label: "Table View",
          accelerator: 'CmdOrCtrl+T',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('table-view')
          }
        },
        {
          label: "Node View",
          accelerator: 'CmdOrCtrl+N',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('node-view')
          }
        },
        {
          label: "Chart Summary View",
          accelerator: 'Shift+CmdOrCtrl+Z',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('chart-summary-view')
          }
        },
        {
          label: "Component Summary View",
          accelerator: 'Shift+CmdOrCtrl+C',
          click: function (menuItem, currentWindow) {
            currentWindow.webContents.send('component-summary-view')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
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
          label: 'Learn More',
          click: function() {
            shell.openExternal('https://github.com/nexB/aboutcode-manager');
          }
        },
        {
          label: 'Licensing Information',
          click: function(item, focusedWindow) {
            var win = new BrowserWindow({ frame: true });
            win.on('closed', function () { win = null });
            win.loadURL('file://' + __dirname + '/attribution.html');
            win.show();

          }
        },
        {
          label: 'Documentation',
          click: function() {
            shell.openExternal(
              `https://github.com/nexB/aboutcode-manager/blob/v${pjson.version}/README.md`
            );
          }
        },
        {
          label: 'Search Issues',
          click: function() {
            shell.openExternal('https://github.com/nexB/aboutcode-manager/issues');
          }
        }
      ]
    },
  ];
const pjson = require('./package.json');

  if (process.platform == 'darwin') {
    template.unshift({
      label: 'AboutCode',
      submenu: [
        {
          label: 'About AboutCode Manager',
          click: function(item, focusedWindow) {
            var win = new BrowserWindow({ frame: true, width: 250, height: 200 });
            win.on('closed', function () { win = null });
            win.loadURL('file://' + __dirname + '/about.html');
            win.show();

          }
        },
        {
          type: 'separator'
        },
        {
          label: `Version ${pjson.version}`,
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
          click: function() { app.quit(); }
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
      label: "Quit",
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit();
      }
    };
  if (process.platform != 'darwin') {
    template[0].submenu.push(quitSubmenu);
  }
  return template;
}