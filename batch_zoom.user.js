// ==UserScript==
// @name         Batch Acquire Zoom
// @namespace    http://tampermonkey.net/
// @version      4.0.1
// @description  For Slate Batch Acquire. Needs Tampermonkey for Chrome or Greasemonkey for Firefox. See readme for more info. 
// @author       University of Michigan OUA Processing (Theodore Ma)
// @match        https://*/manage/database/acquire
// @match        https://*/manage/lookup/*
// @match        https://*/manage/inbox/*
// @updateURL    https://github.com/FranzSpohr/Slate_Tools/blob/master/batch_zoom.user.js
// @grant        none
// ==/UserScript==

var i = 0
var Zoom_Levels = [72, 108, 144, 180, 216];

window.addEventListener('keydown', Toggle_Zoom, true)
window.addEventListener('click', Add_Listener, true)

function Toggle_Zoom (event) {
    if (event.code == 'NumpadAdd'||event.code == 'Equal'||event.type == 'click') {
        event.preventDefault();
        if (i == 4) {
            Click_Zoomer ();
            return;
        }
        const elements = document.querySelectorAll('.batch_page_container > img');
        elements.forEach(function (el) {
            if (el.src.includes(`z=${Zoom_Levels[i]}`)) {
                el.src = el.src.replace(`z=${Zoom_Levels[i]}`, `z=${Zoom_Levels[i+1]}`);
            }
        });
        i++;
        Click_Zoomer ();
    } else if (event.code == 'NumpadSubtract'||event.code == 'Minus'||event.type == 'contextmenu') {
        event.preventDefault();
        if (i == 0) {return};
        const elements = document.querySelectorAll('.batch_page_container > img');
        elements.forEach(function (el) {
            if (el.src.includes(`z=${Zoom_Levels[i]}`)) {
                el.src = el.src.replace(`z=${Zoom_Levels[i]}`, `z=${Zoom_Levels[i-1]}`);
            }
        });
        i--;
    }
}

function Add_Listener () {
    const elements = document.querySelectorAll('.batch_page_container > img');
    elements.forEach(function (el) {
        el.addEventListener('click', Toggle_Zoom, true)
        el.addEventListener('contextmenu', Toggle_Zoom, true)
    })
    const buttons = document.querySelectorAll('button[type="button"]');
    buttons.forEach(function (el) {
        el.addEventListener('click', function () {
            i = 0
        })
    })
}

function Click_Zoomer () {
    var targetNode = document.getElementsByClassName('batch_zoomer boxshadow')[0];
    if (targetNode) {
        //--- Simulate a natural mouse-click sequence.
        triggerMouseEvent (targetNode, "mousedown");
        triggerMouseEvent (targetNode, "mouseup");
        triggerMouseEvent (targetNode, "click");
    }
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
}
