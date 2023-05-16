const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const downloadBtn = document.getElementById('download-btn')
const colorInput = document.getElementById('color');
const colorSwatches = document.getElementsByClassName('color-swatch');
const sizeInput = document.getElementById('size');
const shapeInput = document.getElementById('shape');
const eraseButton = document.getElementById('erase');
const eraseAllButton = document.getElementById('erase-all');
const fileName = document.getElementById('file-name');
const exampleModal = document.getElementById('exampleModal');

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

// event listeners for color input (box) and color swatches (pre- determined buttons)
colorInput.addEventListener('input', () => {
    color = colorInput.value;
});

for (let i = 0; i < colorSwatches.length; i++) {
    colorSwatches[i].addEventListener('click', (e) => {
        color = colorPalette[i];
        colorInput.value = color;
    });
}

sizeInput.addEventListener('input', () => {
    previousSize = size;
    size = sizeInput.value;
});

shapeInput.addEventListener('input', () => {
    previousShape = shape;
    shape = shapeInput.value;
});

// Set event listener for eraser button
eraseButton.addEventListener('click', eraseButtonFunction);

function eraseButtonFunction() {
    eraser = !eraser;
    if (eraser) {
        previousColor = color;
        shape = 'square';
        color = '#ffffff';
        eraseButton.textContent = "Draw"
    } else {
        color = previousColor;
        eraseButton.textContent = "Erase"
    }
}

// Set event listener for erase all button
eraseAllButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    eraseButtonFunction()
});

// TODO: It only saves the the lines but not the white background so the images are transparent. 
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    const newName = fileName.value + '.png'
    link.download = newName
    link.href = canvas.toDataURL('image/png');
    link.click();
});

exampleModal.addEventListener('show.bs.modal', function (event) {
})

// Draw functions
function draw(e) {
    if (!isDrawing) return;

    if (eraser) {
        context.globalCompositeOperation = 'destination-out';
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
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));
