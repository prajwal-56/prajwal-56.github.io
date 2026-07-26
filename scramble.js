/*
   Add data-scramble-phrases to any element. Pipe-separate the list.
*/
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#@';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length  = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => (this.resolve = resolve));

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from  = oldText[i] || '';
      const to    = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end   = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output   = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += '<span class="dud">' + char + '</span>';
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

/* ---- init: runs on every page that loads this script ---- */

function initScramble() {
  document.querySelectorAll('[data-scramble-phrases]').forEach(el => {
    const raw     = el.getAttribute('data-scramble-phrases') || '';
    const phrases = raw.split('|').map(s => s.trim()).filter(Boolean);
    if (phrases.length === 0) return;

    const interval = parseInt(el.getAttribute('data-scramble-interval') || '1500', 10);
    const delay    = parseInt(el.getAttribute('data-scramble-delay')    || '200',  10);

    const fx = new TextScramble(el);
    let counter = 0;

    function cycle() {
      fx.setText(phrases[counter]).then(() => setTimeout(cycle, interval));
      counter = (counter + 1) % phrases.length;
    }

    setTimeout(cycle, delay);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScramble);
} else {
  initScramble(); // script loaded after DOM is ready (end of body)
}
