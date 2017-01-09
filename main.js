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

app.on('ready', createWindow);
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

app.once('ready', function() {
  if (Menu.getApplicationMenu())
    return;

  var template = [
    {
      label: 'Edit',
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
      label: 'View',
      submenu: [
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
      label: 'Window',
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
      label: 'Help',
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
var pjson = require('./package.json');

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

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
