// ==UserScript==
// @name         Batch Acquire Zoom
// @namespace    https://umich.edu/
// @version      11.20.19
// @description  For Slate Batch Acquire. Needs Tampermonkey for Chrome or Greasemonkey for Firefox. See readme for more info.
// @author       University of Michigan OUA Processing (Theodore Ma)
// @match        https://*/manage/database/acquire
// @match        https://*/manage/lookup/*
// @match        https://*/manage/inbox/*
// @updateURL    https://github.com/FranzSpohr/Slate_Tools/blob/master/batch_zoom.user.js
// @grant        none
// ==/UserScript==

var zoomCount = 0; // stores current zoom level
var ListenerAdded = false; // stores whether event listeners were added
var zoom_Levels = [72, 108, 144, 180, 216]; // "z" value that Slate requires to determine size of the document render

const parentElement = window.document;
const mutationConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true,
  characterDataOldValue: true
};

var onMutate = () => {
  if (
    document.getElementById('batch_pages') !== null &&
    ListenerAdded == false
  ) {
    var docWindow = document.getElementById('batch_pages');
    docWindow.addEventListener('load', add_Listener, true);
  }
};

var observer = new MutationObserver(onMutate);
observer.observe(parentElement.body, mutationConfig);

parentElement.addEventListener('keypress', batchZoom, true);

// adds event listeners needed for userscript to function
function add_Listener() {
  if (ListenerAdded) {
    return;
  } else {
    // grabs images and attaches listeners
    const elements = document.querySelectorAll('.batch_page_container > img');
    elements.forEach(el => {
      el.addEventListener('click', batchZoom, true);
      el.addEventListener('contextmenu', batchZoom, true);
    });
    // needed to determine whether "next" buttons, etc. are pressed, meaning listeners have to be attached again
    const buttons = document.querySelectorAll('button[type="button"]');
    buttons.forEach(el => {
      el.addEventListener('click', () => {
        zoomCount = 0;
        ListenerAdded = false;
      });
    });
    ListenerAdded = true;
  }
}

// toggles between zoom levels
function batchZoom(event) {
  if (parentElement.activeElement.nodeName == 'INPUT') {
    return;
  } else {
    if (
      event.code == 'NumpadAdd' ||
      event.code == 'Equal' ||
      event.type == 'click'
    ) {
      event.preventDefault();
      if (zoomCount == 4) {
        hideZoomer();
        return;
      }
      // selects image elements loaded by batch acquire
      const elements = document.querySelectorAll('.batch_page_container > img');

      // replaces the existing "z" value in the URL of documents
      elements.forEach(el => {
        if (el.src.includes(`z=${zoom_Levels[zoomCount]}`)) {
          el.src = el.src.replace(
            `z=${zoom_Levels[zoomCount]}`,
            `z=${zoom_Levels[zoomCount + 1]}`
          );
        }
      });
      zoomCount++;
      hideZoomer();
    } else if (
      event.code == 'NumpadSubtract' ||
      event.code == 'Minus' ||
      event.type == 'contextmenu'
    ) {
      event.preventDefault();
      if (zoomCount == 0) {
        return;
      }
      const elements = document.querySelectorAll('.batch_page_container > img');
      elements.forEach(el => {
        if (el.src.includes(`z=${zoom_Levels[zoomCount]}`)) {
          el.src = el.src.replace(
            `z=${zoom_Levels[zoomCount]}`,
            `z=${zoom_Levels[zoomCount - 1]}`
          );
        }
      });
      zoomCount--;
    }
  }
}

/* kinda janky way to automatically close Slate's useless magnifying glass thingy*/
function hideZoomer() {
  var targetNode = document.getElementsByClassName('batch_zoomer boxshadow')[0];
  if (targetNode) {
    targetNode.parentNode.removeChild(targetNode);
  }
}
