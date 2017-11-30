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
    mainWindow.setTitle('AboutCode Manager');
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.webContents.on('did-finish-load',() => {
        mainWindow.setTitle('AboutCode Manager');
      });
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {
    createWindow();
    Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate()));
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

/** Returns a 'lambda' that sends the event to the render process. */
function sendEventToRender(event) {
    return (menuItem, currentWindow) => currentWindow.webContents.send(event);
}

/** Returns a template for building the main electron menu */
function getTemplate() {
    const template = [
        {
            label: '&File',
            submenu: [
                {
                    label: "Open SQLite File",
                    accelerator: 'CmdOrCtrl+O',
                    click: sendEventToRender('open-SQLite')
                },
                {
                    label: "Save As New SQLite File",
                    accelerator: 'CmdOrCtrl+S',
                    click: sendEventToRender('save-SQLite')
                },
                {
                    label: "Import JSON File",
                    accelerator: 'CmdOrCtrl+I',
                    click: sendEventToRender('import-JSON')
                },
                {
                    label: "Export JSON File",
                    accelerator: 'CmdOrCtrl+E',
                    click: sendEventToRender('export-JSON')
                },
                {
                    label: "Export Components JSON File",
                    accelerator: 'CmdOrCtrl+J',
                    click: sendEventToRender('export-JSON-components-only')
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
                    click: sendEventToRender('table-view')
                },
                {
                    label: "Node View",
                    accelerator: 'CmdOrCtrl+N',
                    click: sendEventToRender('node-view')
                },
                {
                    label: "Chart Summary View",
                    accelerator: 'Shift+CmdOrCtrl+D',
                    click: sendEventToRender('chart-summary-view')
                },
                {
                    label: "Component Summary View",
                    accelerator: 'Shift+CmdOrCtrl+C',
                    click: sendEventToRender('component-summary-view')
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
                    label: 'About AboutCode Manager',
                    click: (item, focusedWindow) => {
                        let win = new BrowserWindow({
                            frame: true,
                            width: 250,
                            height: 200
                        });
                        win.on('closed', () => win = null);
                        win.loadURL('file://' + __dirname + '/about.html');
                        win.show();

                    },
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
                    label: 'Learn More',
                    click: () => shell.openExternal(
                        'https://github.com/nexB/aboutcode-manager/wiki')
                },
                {
                    label: 'Licensing Information',
                    click: (item, focusedWindow) => {
                        let win = new BrowserWindow({frame: true});
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
                    click: (item, focusedWindow) => {
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
            label: "Quit",
            accelerator: 'CmdOrCtrl+Q',
            click: () => app.quit()
        };
    if (process.platform !== 'darwin') {
        template[0].submenu.push(quitSubmenu);
    }
    return template;
}