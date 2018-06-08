import { GridPath } from './pathfinding.js';
import { fromFile } from './image.js';

let resolution = 5;
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start');
const mazeStart = document.getElementById('maze-start');
const mazeEnd = document.getElementById('maze-end');
const resetBtn = document.getElementById('reset');
const resolutionSlider = document.getElementById('resolution');
const resolutionOutput = document.getElementById('resolution-output');
const speedSlider = document.getElementById('speed');
const speedOutput = document.getElementById('speed-output');
let memoryModel = null;
let columns;
let rows;
let wTimeMs = 100;
let interval;
const defaultImg = new Image();
defaultImg.onload = () => {
    canvas.width = defaultImg.width;      // set canvas size big enough for the image
    canvas.height = defaultImg.height;
    ctx.drawImage(defaultImg, 0, 0);
    var event = document.createEvent('Event');
    event.initEvent('mazeimgloaded', true, true);
    document.dispatchEvent(event);
}
defaultImg.src = 'maze.png';

document.addEventListener('mazeimgloaded', function () {
    columns = Math.ceil(canvas.width / resolution);
    rows = Math.ceil(canvas.height / resolution);

    let usestransp = false;
    memoryModel = new Array(rows * columns);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let imgd = ctx.getImageData(x * resolution, y * resolution, resolution, resolution);
            let col = getColor(imgd);
            if (col[3] < 120) usestransp = true;
            let isWhite = (col[0] + col[1] + col[2]) > 382.5;
            memoryModel[y * columns + x] = isWhite;
            // ctx.fillStyle = isWhite ? '#fff' : '#000';
            // ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
        }
    }
    let res = usestransp ? console.warn('this image uses transparency. Transparent regions might be converted to black') : null;
    console.log(memoryModel);
});

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', function() {
    if (interval) clearInterval(interval);
    fromFile();
});

resolutionSlider.addEventListener('change', function(e) {
    resolution = e.target.value;
    resolutionOutput.innerText = e.target.value + 'px';
});

speedSlider.addEventListener('change', function(e) {
    wTimeMs = 300 / e.target.value;
    speedOutput.innerText = e.target.value + '%';
});

triggerEvent('change', resolutionSlider);
triggerEvent('change', speedSlider);

function start() {

    let pathfinding = new GridPath(columns, rows);
    let oldnodes = [];

    let startPos = getStartPos();
    startPos.x = Math.max(0, Math.min(columns, startPos.x));
    startPos.y = Math.max(0, Math.min(rows, startPos.y));
    let endPos = getEndPos();
    endPos.x = Math.max(0, Math.min(columns, endPos.x));
    endPos.y = Math.max(0, Math.min(rows, endPos.y));

    let whileLoopFunc = pathfinding.find(startPos.x + columns * startPos.y, endPos.x + columns * endPos.y, memoryModel);
    interval = setInterval(whileLoopWrapper, wTimeMs);
    function whileLoopWrapper() {
        let ret = whileLoopFunc();
        if (ret !== undefined) return done(ret);
        let inspectedNodes = pathfinding.workingNodes;
        console.log(inspectedNodes);

        // coloring
        for(let i = 0; i < oldnodes.length; i++) {
            ctx.fillStyle = '#f00';
            ctx.fillRect(oldnodes[i] % columns * resolution, Math.floor(oldnodes[i] / columns) * resolution, resolution, resolution);
        }
        
        // coloring
        for(let i = 0; i < inspectedNodes.length; i++) {
            ctx.fillStyle = '#ff0';
            ctx.fillRect(inspectedNodes[i] % columns * resolution, Math.floor(inspectedNodes[i] / columns) * resolution, resolution, resolution);
        }
        oldnodes = inspectedNodes;
    }

    function done(ret) {
        clearInterval(interval); 
        console.log('done');

        for(let i = 0; i < oldnodes.length; i++) {
            ctx.fillStyle = '#f00';
            ctx.fillRect(oldnodes[i] % columns * resolution, Math.floor(oldnodes[i] / columns) * resolution, resolution, resolution);
        }

        for(let i = 0; i < ret.length; i++) {
            ctx.fillStyle = '#00f';
            ctx.fillRect(ret[i] % columns * resolution, Math.floor(ret[i] / columns) * resolution, resolution, resolution);
        }
    }

}

function getColor(imgd) {
    let pix = imgd.data;
    let cols = [0, 0, 0, 0];

    // Loop over each pixel and invert the color.
    for (let i = 0, n = pix.length; i < n; i += 4) {
        cols[0] += pix[i]; // red
        cols[1] += pix[i + 1]; // green
        cols[2] += pix[i + 2]; // blue
        cols[3] += pix[i + 3]; // a
    }
    cols[0] /= (pix.length / 4);
    cols[1] /= (pix.length / 4);
    cols[2] /= (pix.length / 4);
    cols[3] /= (pix.length / 4);
    return cols;
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((evt.clientX - rect.left - canvas.width / resolution * .5) / canvas.width * resolution),
        y: Math.round((evt.clientY - rect.top - canvas.height / resolution * .5) / canvas.height * resolution),
    };
}

function getStartPos() {
    let rect = canvas.getBoundingClientRect();
    let startRect = mazeStart.getBoundingClientRect();
    return {
        x: Math.round((startRect.x - rect.left) / resolution),
        y: Math.round((startRect.y - rect.top) / resolution),
    };
}

function getEndPos() {
    let rect = canvas.getBoundingClientRect();
    let endRect = mazeEnd.getBoundingClientRect();
    return {
        x: Math.round((endRect.x - rect.left) / resolution),
        y: Math.round((endRect.y - rect.top) / resolution),
    };
}


function triggerEvent(name, elem) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(name, false, true);
        elem.dispatchEvent(evt);
    }
    else
    elem.fireEvent(name);
}
