const {BrowserWindow, app} = require('electron');
// include the Node.js 'path' module at the top of your file
const path = require('path')

let win;

let createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        // frame: false
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }

    });
    // win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools();
    win.loadFile(`index.html`);
    win.webContents.openDevTools()
    return win
};

app.whenReady().then(() => {
    createWindow()
        .then(win => downloadAs(
                win,
                "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
                "name",
            )
        )
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

downloadAs = async (win, url, name) => {
    debugger;
    const blob = await axios.get(url, {
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        responseType: 'blob',
    });
    const a = win.document.createElement('a');
    a.href = win.URL.createObjectURL(blob.data);
    a.download = name;
    // a.click();
};
