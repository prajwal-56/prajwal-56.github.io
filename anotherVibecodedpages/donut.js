const pre = document.getElementById('donut');
const R1 = 1;
const R2 = 2;
const K2 = 5;
const K1 = 30;
const screenWidth = 80;
const screenHeight = 40;

let A = 0;
let B = 0;

function render() {
    const b = [];
    const z = [];

    for (let i = 0; i < screenHeight; i++) {
        b[i] = Array(screenWidth).fill(' ');
        z[i] = Array(screenWidth).fill(0);
    }

    const cA = Math.cos(A);
    const sA = Math.sin(A);
    const cB = Math.cos(B);
    const sB = Math.sin(B);

    for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j);
        const st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
            const sp = Math.sin(i);
            const cp = Math.cos(i);
            const h = ct + 2;
            const D = 1 / (sp * h * sA + st * cA + 5);
            const t = sp * h * cA - st * sA;

            const x = Math.floor(screenWidth / 2 + 30 * D * (cp * h * cB - t * sB));
            const y = Math.floor(screenHeight / 2 + 15 * D * (cp * h * sB + t * cB));

            if (x >= 0 && x < screenWidth && y >= 0 && y < screenHeight) {
                const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
                if (L > 0) {
                    if (D > z[y][x]) {
                        z[y][x] = D;
                        const N = Math.floor(L * 8);
                        b[y][x] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
                    }
                }
            }
        }
    }

    pre.textContent = b.map(row => row.join('')).join('\n');
}

function animate() {
    A += 0.04;
    B += 0.02;
    render();
    requestAnimationFrame(animate);
}

animate();
