'use strict'

var imagesFilter
var gElCanvas = document.getElementById('my-canvas');
var gCtx = gElCanvas.getContext('2d');
var gCurrImg

renderStockImages()

function onOpenEditor(id, elImg) {
    document.querySelector('.input1').value = ''
    document.querySelector('.input2').value = ''
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
    // gCtx.drawImage(elImg, 50, 50, 250, 250);
}
var gLine1 = document.querySelector('.input1').value
var gLine1 = document.querySelector('.input2').value

function drawText(x, y) {

    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    drawImg(gCurrImg)
    let size = document.querySelector('#size').value
    gLines[0].txt = document.querySelector('.input1').value
    gLines[1].txt = document.querySelector('.input2').value
    gCtx.lineWidth = '3';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    gCtx.textAlign = 'center';


    gCtx.font = `${gLines[0].size}px IMPACT`;
    gCtx.fillText(gLines[0].txt, gLines[0].x, gLines[0].y);
    gCtx.strokeText(gLines[0].txt, gLines[0].x, gLines[0].y);

    gLines[0].width = gCtx.measureText(gLines[0].txt).width;


    gCtx.font = `${gLines[1].size}px IMPACT`;
    gCtx.fillText(gLines[1].txt, gLines[1].x, gLines[1].y);
    gCtx.strokeText(gLines[1].txt, gLines[1].x, gLines[1].y);

    gLines[1].width = gCtx.measureText(gLines[1].txt).width;


}


function setSize() {
    document.querySelector('#size').value = document.querySelector('#range').value

    gLines.forEach(line => line.size = document.querySelector('#size').value)
    drawText()
    if (gSelectedLine) {
        //debugger
        gSelectedLine.size = document.querySelector('#size').value
        drawRect(gSelectedLine)
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


var gLines = [{
        txt: '',
        size: 55,
        x: 250,
        y: 50,
        color: 'white',
        width: ''
    },
    {
        txt: '',
        size: 55,
        x: 250,
        y: 450,
        color: 'white',
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
    if (gSelectedLine) drawRect(gSelectedLine)
}

function drawRect(line) {
    //debugger
    gCtx.beginPath();
    gCtx.rect(line.x - line.width / 2 - 5, line.y - line.size, line.width + 10, line.size + 10);
    // gCtx.rect(x-75, y-75, 150, 150);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = 'orange';
    //gCtx.fillRect(x, y, 150 / 2, 150 / 2);
}