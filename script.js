const axios = require("axios");
const fs = require("fs");
// /thumbnail?fname=DSC_3144.JPG&fdir=100D3300&ftype=0&time=1392668307
// /download?file=DCIM%5C100D3300%5CDSC_3080.JPG
// /thumbnail?fname=DSC_3143.JPG&fdir=100D3300&ftype=0&time=1392668302
// /download?file=DCIM%5C100D3300%5CDSC_3081.JPG
downloadAs = async (url, name) => {
    const img = document.getElementById('down-image');
    img.src = url;
    const blob = await axios.get(url, {
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        responseType: 'blob',
    });
    img.src = window.URL.createObjectURL(blob.data);
    // img.download = name;
    // img.click();
};

// todo add auto discovery
const input = "http://ezshare.card/dir?dir=A:%5CDCIM%5C100D3300";

function start() {
    const imgPrev = document.getElementById('prev-image');
    const imgFull = document.getElementById('full-image');

    axios.get(input)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("not 200 response")
            }
            const html = response.data;

            const newDiv = document.createElement("div");
            newDiv.innerHTML = html;
            const allElementsUnderPreA = document.evaluate("//pre/a", newDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0, l = allElementsUnderPreA.snapshotLength; i < l; i++) {
                let el = allElementsUnderPreA.snapshotItem(i)
                if (el.href &&
                    el.href.includes("download") &&
                    el.href.includes("JPG")
                ) {
                    imgPrev.src = el.href.replace("download", "thumbnail");
                    imgFull.src = el.href;
                    return
                }
            }
        })
        .catch((err) => {
            throw new Error(err);
        });
}

setInterval(function () {
    start();
}, 1000);
