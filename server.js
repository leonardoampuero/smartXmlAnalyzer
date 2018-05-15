"use strict";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

if(process.argv.length < 5){
    console.error("Missing arguments: originFile diffFile targetId");
}

try {
    const originFilePath = process.argv[2];
    const diffFilePath = process.argv[3];
    const targetId = process.argv[4];

    const originFile = fs.readFileSync(originFilePath).toString();
    const originDom = new JSDOM(originFile);

    const diffFile = fs.readFileSync(diffFilePath).toString();
    const diffDom = new JSDOM(diffFile);

    console.log("Comparing: " + originFilePath + " to: " + diffFilePath + " targetId: " + targetId);

    const oriElement = originDom.window.document.getElementById(targetId);
    const arrayAttb = Array.prototype.slice.apply(oriElement.attributes);

    let element=oriElement.localName;
    let _class;
    let href;

    arrayAttb.forEach(attr => {
        if(attr.name =='class') _class=attr.value;
        else if(attr.name =='href') href=attr.value.replace('#','');
    })

    const cssQuery = element +'[class*="' + _class + '"][href*="'+ href +'"]';
    const diffElement = diffDom.window.document.querySelector(cssQuery);

    if(diffElement){
        console.log("Element found: " + diffElement.localName);
        let path = getPath(diffElement);
        console.log(path);
    }else{
        console.log("Element NOT FOUND");
    }

}catch (e) {
    console.error(e);
}

function getPath(element){
    if(element.parentNode){
        return getPath(element.parentNode) + " > " + element.localName;
    }else{
        return '';
    }

}