const frames = [
    `
 o/
/|
/ \
    `,
    `
\o/
 |
/ \
    `,
    `
 o
/|\
/ \
    `,
    `
 o
/|\
/ >
    `,
    `
 <o
/|\
< \
    `
];

let frameIndex = 0;
const asciiArtElement = document.getElementById('ascii-animation');

function animate() {
    if (asciiArtElement) {
        asciiArtElement.textContent = frames[frameIndex];
        frameIndex = (frameIndex + 1) % frames.length;
    }
}

setInterval(animate, 200);

