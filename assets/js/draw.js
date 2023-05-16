const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const downloadBtn = document.getElementById('download-btn');
const colorInput = document.getElementById('color');
const colorSwatches = document.getElementsByClassName('color-swatch');
const sizeInput = document.getElementById('size');
const shapeInput = document.getElementById('shape');
const eraseButton = document.getElementById('erase');
const eraseAllButton = document.getElementById('erase-all');
const fileName = document.getElementById('file-name');
const undoButton = document.getElementById('undo');

const colorPalette = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

// Set initial color, size, and shape
let size = 10;
let shape = 'round';
let eraser = false;

let color = colorPalette[0]; // Set initial color to the first color in the palette

// saves the color, shape, size from the previous step
let previousColor = color;
let previousSize = size;
let previousShape = shape;

// Set event listeners for canvas mouse events
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Stack to store drawn elements for undo functionality
const drawnElements = [];

// Load saved drawn elements from localStorage on page load
window.addEventListener('load', () => {
    const savedElements = localStorage.getItem('drawnElements');
    if (savedElements) {
        drawnElements.push(...JSON.parse(savedElements));
        redrawElements();
    }
});

// event listeners for color input (box) and color swatches (pre-determined buttons)
colorInput.addEventListener('input', () => {
    color = colorInput.value;
});

for (let i = 0; i < colorSwatches.length; i++) {
    colorSwatches[i].addEventListener('click', (e) => {
        color = colorPalette[i];
        colorInput.value = color;
    });
}

// pen size 
sizeInput.addEventListener('input', () => {
    previousSize = size;
    size = sizeInput.value;
});

// round or square
shapeInput.addEventListener('input', () => {
    previousShape = shape;
    shape = shapeInput.value;
});

// Set event listener for eraser button
eraseButton.addEventListener('click', () => {
    eraser = !eraser;
    if (eraser) {
        previousColor = color;
        color = '#ffffff';
        eraseButton.textContent = 'Draw';
    } else {
        color = previousColor;
        eraseButton.textContent = 'Erase';
    }
});

// Set event listener for erase all button
eraseAllButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    eraseButtonFunction();
    clearSavedElements();
});

// TODO: It only saves the lines but not the white background so the images are transparent.
// downloadBtn.addEventListener('click', () => {
//     const link = document.createElement('a');
//     const newName = fileName.value + '.png';
//     link.download = newName;
//     link.href = canvas.toDataURL('image/png');
//     link.click();
// });
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    const newName = fileName.value + '.png';

    const downloadCanvas = document.createElement('canvas');
    const downloadContext = downloadCanvas.getContext('2d');

    // Set the same width and height as the original canvas
    downloadCanvas.width = canvas.width;
    downloadCanvas.height = canvas.height;

    // Set the background color
    downloadContext.fillStyle = '#ffffff';
    downloadContext.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

    // Draw the existing canvas onto the download canvas
    downloadContext.drawImage(canvas, 0, 0);

    link.download = newName;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();
});

// Event listener for undo button
undoButton.addEventListener('click', () => {
    undoDraw();
});

// Undo draw function 
function undoDraw() {
    if (drawnElements.length > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawnElements.pop();
        redrawElements();
        saveElements();
    }
};

function redrawElements() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    drawnElements.forEach((element) => {
        context.strokeStyle = element.color;
        context.lineWidth = element.size;
        context.lineJoin = element.shape;
        context.lineCap = element.shape;
        context.beginPath();
        context.moveTo(element.startX, element.startY);
        context.lineTo(element.endX, element.endY);
        context.stroke();
    });
};

// clears local storage of the old drawing
function clearSavedElements() {
    localStorage.removeItem('drawnElements');
}

// Save drawn elements to localStorage
function saveElements() {
    localStorage.setItem('drawnElements', JSON.stringify(drawnElements));
};

// Draw functions
function draw(e) {
    if (!isDrawing) return;

    if (eraser) {
        // context.globalCompositeOperation = 'destination-out';
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = '#ffffff';
        context.lineWidth = size;
    } else {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = color;
        context.lineWidth = size;
        context.lineJoin = shape;
        context.lineCap = shape;
    }

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();

    const element = {
        color: context.strokeStyle,
        size: context.lineWidth,
        shape: context.lineJoin,
        startX: lastX,
        startY: lastY,
        endX: e.offsetX,
        endY: e.offsetY,
    };

    drawnElements.push(element);
    saveElements();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));



