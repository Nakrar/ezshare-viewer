const axios = require("axios");

document.addEventListener("DOMContentLoaded", function (event) {

    const HOST = "http://ezshare.card/";
    const IMG_X_PATH = "//table/tbody/tr[2]/td/a/img"
    const IMG_PREV = document.getElementById('prev-image');
    const IMG_FULL = document.getElementById('full-image');
    const BUTTON_NEXT = document.getElementById('next-button');
    const BUTTON_PREV = document.getElementById('prev-button');
    const BUTTON_CURR = document.getElementById('curr-button');
    const ERROR_CONTAINER = document.getElementById('error-container');

    // nodes of all img
    let g_Images = [];
    // index of currently viewed image
    let g_CurrentImage = 0;

    const listOfAllImg = (response) => {
        let results = [];

        const newDiv = document.createElement("div");
        newDiv.innerHTML = response.html;
        const allElementsUnderPreA = document.evaluate(IMG_X_PATH, newDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

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

    const handleClickError = (error) => {
        ERROR_CONTAINER.hidden = true;
    }

    const setDisplayImage = (imgNode) => {
        let filePath = imgNode.src.split("thumbnail")[1];
        IMG_PREV.src = HOST + "thumbnail" + filePath;
        IMG_FULL.src = HOST + "download" + filePath;
    }

    const updateButtonStatus = (nextImageId) => {
        BUTTON_NEXT.disabled = true;
        BUTTON_CURR.disabled = true;
        BUTTON_PREV.disabled = true;

        if (nextImageId === 0) {
            BUTTON_NEXT.disabled = true;
            BUTTON_CURR.disabled = true;
        }
        if (nextImageId === g_Images.length - 1) {
            BUTTON_PREV.disabled = true;
        }
    }

    const handleNextClick = () => {
        g_CurrentImage -= 1
        let nextImg = g_Images[g_CurrentImage]
        setDisplayImage(nextImg)
        updateButtonStatus()
    }

    const handlePrevClick = () => {
        g_CurrentImage += 1
        let prevImg = g_Images[g_CurrentImage]
        setDisplayImage(prevImg)
        updateButtonStatus()
    }

    const handleCurrClick = () => {
        g_CurrentImage = 0;
        updateButtonStatus()
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
                setDisplayImage(g_Images[g_CurrentImage])
                updateButtonStatus(g_CurrentImage)
            })
            .catch((err) => {
                showError(err)
            });
    };

    setInterval(() => {
        main();
    }, 1000);

    BUTTON_NEXT.addEventListener("click", handleNextClick)
    BUTTON_PREV.addEventListener("click", handlePrevClick)
    BUTTON_CURR.addEventListener("click", handleCurrClick)
    ERROR_CONTAINER.addEventListener("click", handleClickError)
});
