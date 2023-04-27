const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const downloadBtn = document.getElementById('download-btn')
const rangeSlider = document.getElementById('size-slider')

ctx.fillStyle = "#FF0000";

let isDrawing = false;

window.addEventListener('resize', resizeCanvas)

// draw functions 
canvas.addEventListener('mousedown', function (e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener('mousemove', function ({ clientX: x, clientY: y }) {
    if (!isDrawing) return;
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke();

    ctx.lineTo(x, y);
    ctx.stroke()
});

canvas.addEventListener('mouseup', function () {
    isDrawing = false;
});

// buttons controllers 
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

rangeSlider.addEventListener('change', (e) => {
    size = e.target.value;
});

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

resizeCanvas()