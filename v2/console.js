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
            appendOutput('available commands: <span style="color:var(--green)">help</span>, <span style="color:var(--green)">clear</span>, <span style="color:var(--green)">matrix [on|off|speed &lt;n&gt;]</span>, <span style="color:var(--green)">credits</span>, <span style="color:var(--green)">cowsay &lt;msg&gt;</span>, <span style="color:var(--green)">donut</span>');
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
        case 'donut':
            appendOutput('Launching spinning 3D ASCII donut...');
            setTimeout(() => {
                window.location.href = 'donut.html';
            }, 600);
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
        '> site by <span style="color:var(--green)">prajwal</span> — prajwal-56.github.io',
        '> ascii animations — hand-picked from the web',
        '> 3d donut — the classic a1k0n spinning donut',
        '> matrix rain — canvas + js, rolled from scratch',
        '> built because it\'s genuinely cool to do'
    ];

    let i = 0;
    function showLine() {
        if (i < credits.length) {
            appendOutput(credits[i]);
            i++;
            setTimeout(showLine, 400);
        }
    }
    showLine();
}
