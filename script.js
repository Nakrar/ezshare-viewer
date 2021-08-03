const axios = require("axios");

const host = "http://ezshare.card/";

const imgXPath = "//table/tbody/tr[2]/td/a/img"

function start() {
    const imgPrev = document.getElementById('prev-image');
    const imgFull = document.getElementById('full-image');

    axios.get(host + "photo")
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("not 200 response")
            }
            const html = response.data;

            const newDiv = document.createElement("div");
            newDiv.innerHTML = html;
            const allElementsUnderPreA = document.evaluate(imgXPath, newDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0, l = allElementsUnderPreA.snapshotLength; i < l; i++) {
                let el = allElementsUnderPreA.snapshotItem(i)
                if (el.src.includes("JPG")) {
                    let filePath = el.src.split("thumbnail")[1];
                    imgPrev.src = host + "thumbnail" + filePath;
                    imgFull.src = host + "download" + filePath;
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
