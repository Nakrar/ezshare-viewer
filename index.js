const {BrowserWindow, app} = require('electron');
const path = require("path");

let win;

let createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        // frame: false
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }

    });

    // win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools();
    win.loadFile(`index.html`);
};

app.whenReady().then(() => {
    createWindow()

    // downloadAs(
    //     "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
    //     "name",
    // )
    //     .then(r => {
    //     })
    //     .catch(e => {
    //         throw e
    //     })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// downloadAs = async (url) => {
//     const blob = await axios.get(url, {
//         headers: {
//             'Content-Type': 'application/octet-stream',
//         },
//         responseType: 'blob',
//     });
//     const a = document.createElement('a');
//     const href = window.URL.createObjectURL(blob.data);
//     a.href = href;
//     a.download = "name";
//     // a.click();
// };
