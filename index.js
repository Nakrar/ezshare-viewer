const {BrowserWindow, app} = require('electron');

const path = require('path')

let win;

let createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile(`index.html`);
    // win.webContents.openDevTools()
    return win
};

app.whenReady().then(() => {
    createWindow()
        .catch(e => {
            throw e
        })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
