const axios = require("axios");

document.addEventListener("DOMContentLoaded", function (event) {

    const HOST = "http://ezshare.card/";
    const IMG_X_PATH = "//tbody/tr[2]/td/a/img"
    const IMG_PREV = document.getElementById('prev-image');
    const IMG_FULL = document.getElementById('full-image');
    const MESSAGE_CONTAINER = document.getElementById('message-container');
    const BUTTON_PREVIOUS = document.getElementById('previous-button');
    const BUTTON_LATEST = document.getElementById('latest-button');
    const BUTTON_NEXT = document.getElementById('next-button');
    const ERROR_CONTAINER = document.getElementById('error-container');

    // nodes of all img
    let g_Images = [];
    // index of currently viewed image
    let g_CurrentImage = 0;

    const listOfAllImg = (response) => {
        let results = [];

        const newDiv = document.createElement("div");
        newDiv.onerror = () => {
        };
        newDiv.innerHTML = response.data;
        const allElementsUnderPreA = document.evaluate(IMG_X_PATH, newDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        newDiv.remove()

        for (let i = 0, l = allElementsUnderPreA.snapshotLength; i < l; i++) {
            let el = allElementsUnderPreA.snapshotItem(i)
            if (el.src.includes("JPG")) {
                results.push(el)
            }
        }

        return results
    }

    const showError = (error) => {
        let now = new Date();
        let time = String(now.getHours()).padStart(2, '0') + ":"
            + String(now.getMinutes()).padStart(2, '0') + ":"
            + String(now.getSeconds()).padStart(2, '0');
        ERROR_CONTAINER.innerText = "ERROR::" + time + "::" + error
        ERROR_CONTAINER.hidden = false;
    }

    const handleClickError = () => {
        ERROR_CONTAINER.hidden = true;
    }

    const setDisplayImage = (imgNode) => {
        MESSAGE_CONTAINER.hidden = true;
        let filePath = imgNode.src.split("thumbnail")[1];
        let newPrev = HOST + "thumbnail" + filePath;
        let newFull = HOST + "download" + filePath;
        if (IMG_PREV.src !== newPrev || IMG_FULL.src !== newFull) {
            IMG_PREV.src = HOST + "thumbnail" + filePath;
            IMG_FULL.hidden = false;
            IMG_PREV.hidden = false;
            IMG_FULL.src = "";
            IMG_FULL.src = HOST + "download" + filePath;
        }
    }

    const updateButtonStatus = (nextImageId) => {
        if (g_Images.length === 0) {
            BUTTON_NEXT.disabled = true;
            BUTTON_LATEST.disabled = true;
            BUTTON_PREVIOUS.disabled = true;
            return
        }

        BUTTON_NEXT.disabled = false;
        BUTTON_LATEST.disabled = false;
        BUTTON_PREVIOUS.disabled = false;
        if (nextImageId === 0) {
            BUTTON_NEXT.disabled = true;
            BUTTON_LATEST.disabled = true;
        }
        if (nextImageId >= g_Images.length - 1) {
            BUTTON_PREVIOUS.disabled = true;
        }
    }

    const handleNextClick = () => {
        g_CurrentImage -= 1
        let nextImg = g_Images[g_CurrentImage]
        updateButtonStatus(g_CurrentImage)
        setDisplayImage(nextImg)
    }

    const handlePrevClick = () => {
        g_CurrentImage += 1
        let prevImg = g_Images[g_CurrentImage]
        updateButtonStatus(g_CurrentImage)
        setDisplayImage(prevImg)
    }

    const handleRecentClick = () => {
        g_CurrentImage = 0;
        updateButtonStatus(g_CurrentImage)
    }

    const main = () => {
        if (g_CurrentImage !== 0) {
            return
        }

        axios.get(HOST + "photo")
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("not a 200 response")
                }
                g_Images = listOfAllImg(response)
                if (g_Images.length > 0) {
                    setDisplayImage(g_Images[0])
                    updateButtonStatus(0)
                }
            })
            .catch((err) => {
                showError(err)
            });
    };

    ERROR_CONTAINER.hidden = true;
    updateButtonStatus()

    IMG_FULL.hidden = true
    IMG_PREV.hidden = true
    IMG_FULL.onload = () => {
        IMG_PREV.hidden = true;
    }
    BUTTON_NEXT.addEventListener("click", handleNextClick)
    BUTTON_PREVIOUS.addEventListener("click", handlePrevClick)
    BUTTON_LATEST.addEventListener("click", handleRecentClick)
    ERROR_CONTAINER.addEventListener("click", handleClickError)

    setInterval(() => {
        main();
    }, 1000);
});
