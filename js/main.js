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
    let text2 = document.querySelector('.input2').value
    gCtx.lineWidth = '3';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    gCtx.font = `${size}px IMPACT`;
    gCtx.textAlign = 'center';
    gCtx.fillText(gLines[0].txt, gLines[0].x, gLines[0].y);
    gCtx.strokeText(gLines[0].txt, gLines[0].x, gLines[0].y);
    gCtx.fillText(gLines[1].txt, gLines[1].x, gLines[1].y);
    gCtx.strokeText(gLines[1].txt, gLines[1].x, gLines[1].y);


}


function setSize() {
    document.querySelector('#size').value = document.querySelector('#range').value
    drawText()
}

function onMoveUp() {

}

function onMoveDown() {

}


var gLines = [{
        txt: '',
        size: 55,
        x: 250,
        y: 50,
        color: 'white'
    },
    {
        txt: '',
        size: 55,
        x: 250,
        y: 450,
        color: 'white'
    }
]



function canvasClicked(ev) {
    // TODO: find out if clicked inside of star chart
    const { offsetX: x, offsetY: y } = ev;

    var clickedLine = gLines.find((line, idx) => {
        //debugger
        if (x >= line.x - line.size && x <= line.size + line.x) return line
    });
    console.log(clickedLine);
    console.log({ offsetX: x, offsetY: y });


    // TODO: open the modal on the clicked coordinates if found a click on a star,
    // close the modal otherwise

    // const { clientX, clientY } = ev;
    // if (clickedStar) openModal(clickedStar, clientX, clientY);
    // else closeModal();
}