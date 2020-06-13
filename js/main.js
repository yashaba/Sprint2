'use strict'

var imagesFilter
var gElCanvas = document.getElementById('my-canvas');
var gCtx = gElCanvas.getContext('2d');
var gCurrImg



function init() {
    renderStockImages()
    renderEmoji()
}


function onOpenEditor(id, elImg) {
    document.querySelector('.input1').value = ''
    document.querySelector('#size-range').value = 55
    document.querySelector('main').style.display = 'none'

    // gElCanvas.width = 500;
    // gElCanvas.height = 500;
    gElCanvas.style.width = '100%';
    gElCanvas.style.height = '100%';
    gElCanvas.width = gElCanvas.offsetWidth;
    gElCanvas.height = gElCanvas.offsetHeight;

    drawImg(elImg)
    gCurrImg = elImg
    document.querySelector('.editor').style.visibility = 'visible';

}

function onHideEditor() {
    document.querySelector('.editor').style.visibility = 'hidden'
    document.querySelector('main').style.display = 'block'
    gLines = [{
        idx: 0,
        txt: '',
        font: '',
        size: 55,
        x: 250,
        y: 50,
        color: 'white',
        stoke: 'black',
        width: ''
    }, { idx: 1, txt: '', font: '', size: 55, x: 250, y: 450, color: 'white', stroke: 'black', width: '' }]
    gStickers = []
    gSelectedLine = null
    gSelectedSticker = null
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

var gSubmitIdx = 0

function onSubmit() {

    if (!gSelectedLine) {
        if (gSubmitIdx === gLines.length) {
            gLines.push({
                idx: gSubmitIdx,
                txt: '',
                font: '',
                size: 55,
                x: 250,
                y: 250,
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

var gLines = [{
        idx: 0,
        txt: '',
        font: '',
        size: 55,
        x: 250,
        y: 50,
        color: 'white',
        stoke: 'black',
        width: ''
    },
    {
        idx: 1,
        txt: '',
        font: '',
        size: 55,
        x: 250,
        y: 450,
        color: 'white',
        stroke: 'black',
        width: ''
    }
]

var gSelectedLine
var gSelectedSticker

function canvasClicked(ev) {
    const { offsetX: x, offsetY: y } = ev;
    console.log(x, y);

    var clickedLine = gLines.find((line, idx) => {

        if (x >= line.x - line.width / 2 && x < line.x + line.width / 2 && y > line.y - line.size + 11 && y < line.y) return line
    });
    var clickedSticker = gStickers.find((sticker, idx) => {

        if (x >= sticker.x && x < sticker.x + sticker.size && y > sticker.y && y < sticker.y + sticker.size) return sticker
    });
    gSelectedLine = clickedLine
    gSelectedSticker = clickedSticker
    if (gSelectedLine) {
        drawRect(gLines[gSelectedLine.idx])
        document.querySelector('.input1').value = gSelectedLine.txt
        gDiffX = getDiff(ev).diffX
        gDiffY = getDiff(ev).diffY
    } else {
        document.querySelector('.input1').value = ''
        drawText()
    }
    if (gSelectedSticker) {
        drawRectSticker(gStickers[gSelectedSticker.idx])
        gDiffX = getDiff(ev).diffX
        gDiffY = getDiff(ev).diffY
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

var gResizeActive = false

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

var gDiffX
var gDiffY

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



function renderEmoji() {
    let container = document.querySelector('.sticker-container')
    for (let i = 1; i < 22; i++) {
        container.innerHTML += `<img draggable="true" ondrag='setImg(this)'  src="./svgs/stickers/${i}.svg">`
    }

}
var gDraggedImg
var gStickers = []
var gStickerIdx = 0

function drawSticker(ev) {
    ev.preventDefault();
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


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas

    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
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