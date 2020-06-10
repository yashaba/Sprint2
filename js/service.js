'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gId = 0
var gImgs = [
    createImg("angry man"),
    createImg("puppy animal"),
    createImg("puppy baby animal"),
    createImg("cat animal"),
    createImg("baby"),
    createImg("man"),
    createImg("baby"),
    createImg("man"),
    createImg("baby"),
    createImg("man lauging"),
    createImg("man"),
    createImg("man"),
    createImg("man"),
    createImg("man"),
    createImg("man"),
    createImg("man"),
    createImg("man"),
    createImg("toy"),
];


function createImg(keywords) {
    gId++
    return {

        id: gId,
        url: `./meme-imgs (square)/${gId}.jpg`,
        keywords: keywords.split(" ")

    }
}

function getImgsToRender() {
    // filter here
    //filter operation

    return gImgs

}

function getNextId() {

    var maxId = loadFromStorage('max-id')
    if (!maxId) maxId = 0
    var nextId = maxId + 1
    saveToStorage('max-id', nextId)

    return nextId
}