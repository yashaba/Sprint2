'use strict'

var imagesFilter
var gElCanvas = document.getElementById('my-canvas');
var gCtx = gElCanvas.getContext('2d');
var gCurrImg
var gDraggedImg
var gStickers = []
var gStickerIdx = 0
var gSelectedLine
var gSelectedSticker
var gSubmitIdx = 0
var gDiffX
var gDiffY
var gResizeActive = false

console.log(gElCanvas.height);

var gLines = [{
        idx: 0,
        txt: '',
        font: '',
        size: 55,
        x: gElCanvas.width * 0.5,
        y: gElCanvas.height * 0.05,
        color: 'white',
        stoke: 'black',
        width: ''
    },
    {
        idx: 1,
        txt: '',
        font: '',
        size: 55,
        x: gElCanvas.width * 0.5,
        y: gElCanvas.height * 0.95,
        color: 'white',
        stroke: 'black',
        width: ''
    }

]



function onInit() {
    renderStockImages()
    renderEmoji()
        //onResizeCanvas()
}


function onOpenEditor(id, elImg) {
    document.querySelector('.input1').value = ''
    document.querySelector('#size-range').value = 55
    document.querySelector('main').style.display = 'none'



    var elContainer = document.querySelector('.canvas-wrapper');
    // Note: changing the canvas dimension this way clears the canvas


    console.log('resize trigger');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;

    gLines[0].x = gElCanvas.width * 0.5
    gLines[0].y = gElCanvas.height * 0.10
    gLines[0].size = gElCanvas.width * 0.1
    gLines[1].x = gElCanvas.width * 0.5
    gLines[1].y = gElCanvas.height * 0.95
    gLines[1].size = gElCanvas.width * 0.1



    // gElCanvas.width = 500;
    // gElCanvas.height = 500;
    // onResizeCanvas()
    // gElCanvas.style.width = '100%';
    // gElCanvas.style.height = '100%';
    // gElCanvas.width = gElCanvas.offsetWidth;
    // gElCanvas.height = gElCanvas.offsetHeight;

    drawImg(elImg)
    gCurrImg = elImg
    document.querySelector('.editor').style.visibility = 'visible';


}

function onHideEditor() {
    document.querySelector('.editor').style.visibility = 'hidden'
    document.querySelector('main').style.display = 'block'
    resetGlobals()
}

function renderStockImages() {
    let elStockContainer = document.querySelector('stock-images')
    let imgs = getImgsToRender()

    imgs.forEach(img => elStockContainer.innerHTML += `<img onclick='onOpenEditor(${img.id},this)' src= '${img.url}'>`)
}

function drawImg(elImg, x = 0, y = 0, ) {
    gCtx.drawImage(elImg, x, y, gElCanvas.width, gElCanvas.height);
}

function drawText(x, y) {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    drawImg(gCurrImg)
    gCtx.lineWidth = '3';
    gCtx.strokeStyle = document.querySelector('#stroke').value;
    gCtx.fillStyle = document.querySelector('#color').value;;
    gCtx.textAlign = 'center';
    let domFont = document.querySelector('#font').value

    gLines.forEach(line => {
        line.font = domFont

        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.fillText(line.txt, line.x, line.y);
        gCtx.strokeText(line.txt, line.x, line.y);
        line.width = gCtx.measureText(line.txt).width;
    })
    gStickers.forEach(sticker => {
        gCtx.drawImage(sticker.img, sticker.x, sticker.y, sticker.size, sticker.size)
    })

    if (gSelectedLine) drawRect(gSelectedLine)
    if (gSelectedSticker) drawRectSticker(gSelectedSticker)

}

function getTextAllign() {
    let txtAlVal = +document.querySelector('#text-allign').value
    if (txtAlVal === 0) gLines.forEach(line => line.x = 0 + line.width / 2)
    if (txtAlVal === 30) gLines.forEach(line => line.x = 250)
    if (txtAlVal === 60) gLines.forEach(line => line.x = 500 - line.width / 2)
    drawText()
}

function setSize() {
    //document.querySelector('#size').value = document.querySelector('#size-range').value
    if (!gSelectedLine) {
        gLines.forEach(line => line.size = document.querySelector('#size-range').value)
        drawText()
    }
    if (gSelectedLine) {
        gLines[gSelectedLine.idx].size = document.querySelector('#size-range').value
        drawText()
        drawRect(gLines[gSelectedLine.idx])
    }
}

function onMoveUp() {
    gSelectedLine.y -= 10
    drawText()
    drawRect(gSelectedLine)
}

function onMoveDown() {
    gSelectedLine.y += 10
    drawText()
    drawRect(gSelectedLine)
}

function onSwitch() {
    if (!gSelectedLine) return
    gSelectedLine = gLines[gSelectedLine.idx + 1]
    if (!gSelectedLine) gSelectedLine = gLines[0]
    if (gSelectedLine.txt === '') onSwitch()
    drawText()
    drawRect(gSelectedLine)
}



function onSubmit() {

    if (!gSelectedLine) {
        if (gSubmitIdx === gLines.length) {
            gLines.push({
                idx: gSubmitIdx,
                txt: '',
                font: '',
                size: gElCanvas.width * 0.1,
                x: gElCanvas.width * 0.5,
                y: gElCanvas.height * 0.5,
                color: 'white',
                stroke: 'black',
                width: ''
            })
        }
        gLines[gSubmitIdx].txt = document.querySelector('.input1').value
        document.querySelector('.input1').value = ''
        drawText()
        gSubmitIdx++
        return
    }

    gLines[gSelectedLine.idx].txt = document.querySelector('.input1').value
    document.querySelector('.input1').value = ''
    drawText()
}


function onEdit() {
    if (!gSelectedLine) return
    gLines[gSelectedLine.idx].txt = document.querySelector('.input1').value
    drawText()
}

function onDeleteLine() {
    if (!gSelectedLine) return
    gLines[gSelectedLine.idx].txt = ''
    gSelectedLine = null
    document.querySelector('.input1').value = ''
    drawText()
}




function canvasClicked(ev) {
    const { offsetX: x, offsetY: y } = ev;


    console.log(x, y);
    //console.log(ev.type);

    if (ev.type === "touchstart") {
        console.log('touched')
        console.log(ev);
        return
    };



    let clickedLine = gLines.find((line) => {

        if (x >= line.x - line.width / 2 &&
            x < line.x + line.width / 2 &&
            y > line.y - line.size + 11 &&
            y < line.y) return line
    });

    let clickedSticker = gStickers.find((sticker) => {

        if (x >= sticker.x &&
            x < sticker.x + sticker.size &&
            y > sticker.y &&
            y < sticker.y + sticker.size) return sticker
    });

    gSelectedLine = clickedLine
    gSelectedSticker = clickedSticker

    if (gSelectedLine) {
        drawRect(gLines[gSelectedLine.idx])
        document.querySelector('.input1').value = gSelectedLine.txt
        gDiffX = getDiff(ev).diffX
        gDiffY = getDiff(ev).diffY

    } else {

        ///Clearing text box if the user clicks on an empty spot
        document.querySelector('.input1').value = ''
        drawText()
    }
    if (gSelectedSticker) {
        drawRectSticker(gStickers[gSelectedSticker.idx])
        gDiffX = getDiff(ev).diffX
        gDiffY = getDiff(ev).diffY

        ////// Checking if user is dragging the blue ball
        if (x >= gSelectedSticker.x + gSelectedSticker.size - 10 &&
            x < gSelectedSticker.x + gSelectedSticker.size &&
            y > gSelectedSticker.y - 10 &&
            y < gSelectedSticker.y + gSelectedSticker.size) {
            gResizeActive = true

            return
        }
    }

    gResizeActive = false
}



function initResize(ev) {
    const { offsetX: x, offsetY: y } = ev;
    if (gResizeActive && ev.buttons === 1) {
        let currSticker = gStickers[gSelectedSticker.idx]
        currSticker.size = (x - currSticker.x)
        drawText()
        console.log(currSticker.size);
    }
}

function drawRect(line) {
    gCtx.beginPath();
    gCtx.rect(line.x - line.width / 2 - 5, line.y - line.size, line.width + 10, line.size * 1.25);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = 'orange';

}

function drawRectSticker(sticker) {
    gCtx.beginPath();
    gCtx.rect(sticker.x, sticker.y, sticker.size, sticker.size);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = 'orange';

    drawArc(sticker.x + sticker.size - 3.5, sticker.y + sticker.size - 3.5)

}



function dragLine(ev) {
    if (gResizeActive) return



    if (ev.buttons === 1 && gSelectedLine) {
        gLines[gSelectedLine.idx].x = ev.offsetX + gDiffX
        gLines[gSelectedLine.idx].y = ev.offsetY + gDiffY
        drawText()
    }
    if (ev.buttons === 1 && gSelectedSticker) {
        gStickers[gSelectedSticker.idx].x = ev.offsetX + gDiffX
        gStickers[gSelectedSticker.idx].y = ev.offsetY + gDiffY
        drawText()
    }
}

function getDiff(ev) {
    if (gSelectedLine) {
        return {
            diffX: gLines[gSelectedLine.idx].x - ev.offsetX,
            diffY: gLines[gSelectedLine.idx].y - ev.offsetY
        }
    }
    if (gSelectedSticker) {
        return {
            diffX: gStickers[gSelectedSticker.idx].x - ev.offsetX,
            diffY: gStickers[gSelectedSticker.idx].y - ev.offsetY
        }
    }
}


function onDownloadCanvas(elLink) {
    gSelectedLine = null
    drawText()
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my_img.png';
}


/////////////////////////////////////
function renderEmoji() {
    let container = document.querySelector('.sticker-container')
    for (let i = 1; i < 22; i++) {
        container.innerHTML += `<img ontouchstart='drawSticker(event, this)' class='touch' draggable="true" ondrag='setImg(this)'  src="./svgs/stickers/${i}.svg">`
    }
}


function drawSticker(ev, elImg) {
    ev.preventDefault();
    if (ev.type === 'touchstart') {
        gCtx.drawImage(elImg, 250, 250 - 25, 50, 50);
        return
    }

    gCtx.drawImage(gDraggedImg, ev.offsetX - 25, ev.offsetY - 25, 50, 50);
    console.log(gDraggedImg, ev.offsetX, ev.offsetY);

    gStickers.push({
        idx: gStickerIdx++,
        img: gDraggedImg,
        x: ev.offsetX - 25,
        y: ev.offsetY - 25,
        size: 50
    })
}

function setImg(elImg) {
    gDraggedImg = elImg
}

var gOriginalCanvas = document.querySelector('.canvas-wrapper').offsetWidth

function onResizeCanvas() {
    var elContainer = document.querySelector('.canvas-wrapper');
    // Note: changing the canvas dimension this way clears the canvas

    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;

    var diff = gOriginalCanvas - elContainer.offsetWidth
    let y = gElCanvas.height * 0.10
    for (let i = 0; i < gLines.length; i++) {
        if (i === 1) y = gElCanvas.height * 0.95
        if (i > 1) y = gElCanvas.height * 0.5
        gLines[i].x = gElCanvas.width * 0.5
        gLines[i].y = y
        gLines[i].size = gElCanvas.width * 0.1

    }

    gStickers.forEach(sticker => {
        sticker.size = gElCanvas.width * 0.1
        sticker.x = gElCanvas.height * 0.5
        sticker.y = gElCanvas.height * 0.5
    })

    drawImg(gCurrImg)
    drawText()
}

function drawArc(x, y) {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, 3, 0, 2 * Math.PI);
    gCtx.strokeStyle = 'white'
    gCtx.stroke();
    gCtx.fillStyle = 'blue'
    gCtx.fill()

}




function handleTouch(ev) {
    ev.preventDefault()
    console.log(ev);
}