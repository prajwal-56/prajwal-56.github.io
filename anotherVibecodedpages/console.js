const consoleElement = document.getElementById('console');
const consoleInput = document.getElementById('console-input');
const consoleOutput = document.getElementById('console-output');

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '`') {
        consoleElement.classList.toggle('hidden');
        if (!consoleElement.classList.contains('hidden')) {
            consoleInput.focus();
        }
    }
});

consoleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = consoleInput.value;
        consoleInput.value = '';
        appendOutput(`> ${command}`);
        handleCommand(command);
    }
});

function appendOutput(text) {
    const p = document.createElement('p');
    p.innerHTML = text; // Use innerHTML to allow for HTML tags in output
    consoleOutput.appendChild(p);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function handleCommand(command) {
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
        case 'help':
            appendOutput('Available commands: help, clear, matrix, credits, cowsay');
            break;
        case 'clear':
            consoleOutput.innerHTML = '';
            break;
        case 'matrix':
            handleMatrixCommand(args);
            break;
        case 'credits':
            showCredits();
            break;
        case 'cowsay':
            handleCowsayCommand(args);
            break;
        default:
            appendOutput(`Command not found: ${cmd}`);
    }
}

function handleCowsayCommand(args) {
    const message = args.join(' ');
    if (message) {
        const cow = cowsay.say({ text: message });
        appendOutput(`<pre>${cow}</pre>`);
    } else {
        appendOutput('Usage: cowsay <message>');
    }
}

function handleMatrixCommand(args) {
    const [subCmd, value] = args;
    switch (subCmd) {
        case 'on':
            startMatrix();
            appendOutput('Matrix animation started.');
            break;
        case 'off':
            stopMatrix();
            appendOutput('Matrix animation stopped.');
            break;
        case 'speed':
            if (value) {
                const speed = parseInt(value, 10);
                if (!isNaN(speed) && speed > 0) {
                    setMatrixSpeed(speed);
                    appendOutput(`Matrix speed set to ${speed}ms.`);
                } else {
                    appendOutput('Invalid speed value. Please use a positive number.');
                }
            } else {
                appendOutput('Usage: matrix speed <value>');
            }
            break;
        default:
            appendOutput('Usage: matrix [on|off|speed <value>]');
    }
}

function showCredits() {
    const credits = [
        'Website created by Gemini',
        'ASCII Art Animations from the web',
        '3D Donut code by a clever human',
        'Special thanks to the user for the inspiration'
    ];

    let i = 0;
    function showLine() {
        if (i < credits.length) {
            appendOutput(credits[i]);
            i++;
            setTimeout(showLine, 500);
        }
    }
    showLine();
}
