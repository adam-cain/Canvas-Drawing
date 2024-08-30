const ZOOMMIN = 0.8
//const ZOOMMIN = 1

const ZOOMMAX = 200
const LIMITRATIO = 2
const X = 1001;
const Y = 1001;

const root = document.documentElement;
const rootStyle = document.documentElement.style;

let ctx
let canvasElement
var selectorElement
var transformLimit
var pixelX, pixelY
{//Set/Gets for CSS
function setZoom(zoom) {
    rootStyle.setProperty("--canvas-zoom", Math.min(Math.max(zoom, ZOOMMIN), ZOOMMAX))
}

function getZoom() {
    return rootStyle.getPropertyValue("--canvas-zoom")
}

function setCanvasPos(x,y) {
    if(Number.isFinite(x)) rootStyle.setProperty("--canvas-x", Math.min(Math.max(x, -transformLimit), transformLimit) + "px")
    if(Number.isFinite(y)) rootStyle.setProperty("--canvas-y", Math.min(Math.max(y, -transformLimit), transformLimit) + "px")
}

function setCanvasXPos(x) {
    setCanvasPos(x,undefined)
}
function setCanvasYPos(y) {
    setCanvasPos(undefined,y)
}

function getCanvasXPos() {
    return parseFloat(rootStyle.getPropertyValue("--canvas-x"))
}
function getCanvasYPos() {
    return parseFloat(rootStyle.getPropertyValue("--canvas-y"))
}
}
window.onload = function () {
    drawCanvas()
    transformLimit = canvasElement.clientHeight / 2
    selectorElement = document.getElementById("selector")

    frag = new URLSearchParams(window.location.hash.slice(1))
    scale = frag.get("s")
    xTransform = frag.get("x")
    yTransform = frag.get("y")
    if (!isNaN(scale)) { setZoom(scale) }
    else { setZoom(ZOOMMIN) }
    if (!isNaN(xTransform)) { setCanvasXPos(xTransform * transformLimit) }
    else { setCanvasXPos(0) }
    if (!isNaN(yTransform)) { setCanvasYPos(yTransform * transformLimit) }
    else { setCanvasYPos(0) }
    
    if (window.addEventListener) {
        document.addEventListener("DOMMouseScroll", zoomCanvas)
        document.addEventListener("DOMMouseScroll", debounce(updateBookmark))
        document.addEventListener("DOMMouseScroll", updateCoordinates)
        document.addEventListener("mousedown", mouseDown);
        document.addEventListener("mouseup", mouseUp);
        document.addEventListener('mousemove', mouseMove);
        window.addEventListener('resize', () => { transformLimit = canvasElement.clientHeight / 2; })
        canvasElement.addEventListener('mousedown', pixelClicked)
        canvasElement.addEventListener('mousemove', updateCoordinates);
    }

    document.onmousewheel = zoomCanvas;
};

function updateCoordinates(e){
    var rect = canvasElement.getBoundingClientRect();
    pixelX = Math.floor((e.clientX - rect.left) * X / rect.width)
    pixelY = Math.floor((e.clientY - rect.top) * Y / rect.height)
    updateSelector()
}

function pixelClicked() {
    drawPixel(pixelX,pixelY, "#" + Math.floor(Math.random() * 16777215).toString(16))
}

function updateSelector(){
    var rect = canvasElement.getBoundingClientRect();
    var pixelSize = rect.width/X
    rootStyle.setProperty("--selector-x",rect.left + (pixelX * pixelSize) + "px")
    rootStyle.setProperty("--selector-y",rect.top + (pixelY * pixelSize) +"px")
    //1.5 to negate border size: 1px (on each side)
    rootStyle.setProperty("--selector-size",pixelSize-1.5)
}

function drawCanvas() {
    var dx, dy, x, y;
    x = y = dx = 0;
    dy = -1;

    canvasElement = document.getElementById('canvas')
    canvasElement.width = X
    canvasElement.height = Y
    
    ctx = canvasElement.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    var imgdata = ctx.getImageData(0, 0, X, Y);

    for (var i = 0; i <= Math.pow(Math.max(X, Y), 2); i++) {
        if (-X / 2 < x && x <= X / 2 && -Y / 2 < y && y <= Y / 2) {
            var pixel = coordsToData(x, y)

            imgdata.data[4 * pixel] = x;    // RED (0-255)
            imgdata.data[4 * pixel + 1] = y;    // GREEN (0-255)
            imgdata.data[4 * pixel + 2] = x / y * X;    // BLUE (0-255)
            imgdata.data[4 * pixel + 3] = 255;  // APLHA (0-255)

            if (x === y || x < 0 && x === -y || x > 0 && x === 1 - y) {
                [dx, dy] = [-dy, dx];
            }
            [x, y] = [x + dx, y + dy];
        }
    }
    ctx.putImageData(imgdata, 0, 0);
}

var startX, startY
startX = startY = 0

mouseDownFlag = false

function mouseDown(event) {
    mouseDownFlag = true
    startX = event.clientX
    startY = event.clientY
}

function mouseUp(event) {
    mouseDownFlag = false
    updateBookmark()
}

function mouseMove(event) {
    if (mouseDownFlag) {
        //change in mouse position
        deltaX = -(startX - event.clientX) / getZoom();
        deltaY = -(startY - event.clientY) / getZoom();
        setCanvasPos(getCanvasXPos() + deltaX, getCanvasYPos()+ deltaY)
        startX = event.clientX
        startY = event.clientY
    }
}

function zoomCanvas(event) {
    var delta = 0;
    if (!event) event = window.event;
    delta = -event.detail / 2;
    setZoom(getZoom() - delta)
}

function updateBookmark() {
    hash = new URLSearchParams(window.location.hash.slice(1))
    hash.set("s", rootStyle.getPropertyValue("--canvas-zoom"))
    hash.set("x", parseFloat(rootStyle.getPropertyValue("--canvas-x"))/ transformLimit)
    hash.set("y", parseFloat(rootStyle.getPropertyValue("--canvas-y"))/ transformLimit)
    window.location.hash = hash
}

function drawPixel(x, y, colour) {
    ctx.fillStyle = colour;
    ctx.imageSmoothingEnabled = false
    ctx.fillRect(x, y, 1, 1);
}

function coordsToData(x, y) {
    return (X * (y + (Math.floor(Y / 2)))) + x + Math.floor(X / 2)
}

function debounce(func, timeout = 500){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}