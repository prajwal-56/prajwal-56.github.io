const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+-=[]{};\':|".<>/ ?';
const fontSize = 18;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

let matrixInterval;
let matrixSpeed = 33;
let matrixEnabled = true;

function draw() {
    if (!matrixEnabled) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

function startMatrix() {
    if (!matrixInterval) {
        matrixInterval = setInterval(draw, matrixSpeed);
    }
    matrixEnabled = true;
}

function stopMatrix() {
    clearInterval(matrixInterval);
    matrixInterval = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    matrixEnabled = false;
}

function setMatrixSpeed(speed) {
    matrixSpeed = speed;
    if (matrixEnabled) {
        stopMatrix();
        startMatrix();
    }
}

startMatrix();