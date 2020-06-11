'use strict'

var imagesFilter
var gElCanvas = document.getElementById('my-canvas');
var gCtx = gElCanvas.getContext('2d');
var gCurrImg

renderStockImages()

function onOpenEditor(id, elImg) {
    document.querySelector('.input1').value = ''
    document.querySelector('#size').value = 55


    gElCanvas.width = 500;
    gElCanvas.height = 500;
    drawImg(elImg)
    gCurrImg = elImg
    document.querySelector('.editor').style.visibility = 'visible';

}

function onHideEditor() {
    document.querySelector('.editor').style.visibility = 'hidden'
}

function renderStockImages() {
    let elStockContainer = document.querySelector('stock-images')
    let imgs = getImgsToRender()

    imgs.forEach(img => elStockContainer.innerHTML += `<img onclick='onOpenEditor(${img.id},this)' src= '${img.url}'>`)
}



function drawImg(elImg) {
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function drawText(x, y) {

    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    drawImg(gCurrImg)

    gCtx.lineWidth = '3';
    gCtx.strokeStyle = document.querySelector('#stroke').value;
    gCtx.fillStyle = document.querySelector('#color').value;;
    gCtx.textAlign = 'center';

    let domFont = document.querySelector('#font').value
    let textAlign
    gLines.forEach(line => {
        line.font = domFont

        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.fillText(line.txt, line.x, line.y);
        gCtx.strokeText(line.txt, line.x, line.y);
        line.width = gCtx.measureText(line.txt).width;
    })

    if (gSelectedLine) drawRect(gSelectedLine)

}

function getTextAllign() {
    let txtAlVal = +document.querySelector('#text-allign').value
    if (txtAlVal === 0) gLines.forEach(line => line.x = 0 + line.width / 2)
    if (txtAlVal === 30) gLines.forEach(line => line.x = 250)
    if (txtAlVal === 60) gLines.forEach(line => line.x = 500 - line.width / 2)
    drawText()
}

function setSize() {
    document.querySelector('#size').value = document.querySelector('#size-range').value
    if (!gSelectedLine) {
        gLines.forEach(line => line.size = document.querySelector('#size').value)
        drawText()
    }
    if (gSelectedLine) {
        gLines[gSelectedLine.idx].size = document.querySelector('#size').value
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

function canvasClicked(ev) {
    const { offsetX: x, offsetY: y } = ev;
    var clickedLine = gLines.find((line, idx) => {
        //debugger
        if (x >= line.x - line.width / 2 && x < line.x + line.width / 2 && y > line.y - line.size + 11 && y < line.y) return line
    });
    gSelectedLine = clickedLine
    if (gSelectedLine) {
        drawRect(gLines[gSelectedLine.idx])
        document.querySelector('.input1').value = gSelectedLine.txt
        gDiffX = getDiff(ev).diffX
        gDiffY = getDiff(ev).diffY
    }

    drawText()
}

function drawRect(line) {
    gCtx.beginPath();
    gCtx.rect(line.x - line.width / 2 - 5, line.y - line.size, line.width + 10, line.size * 1.25);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = 'orange';

}

var gDiffX
var gDiffY

function dragLine(ev) {

    if (ev.buttons === 1 && gSelectedLine) {
        gLines[gSelectedLine.idx].x = ev.offsetX + gDiffX
        gLines[gSelectedLine.idx].y = ev.offsetY + gDiffY
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
}