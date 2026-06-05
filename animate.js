/* ========================================
   animate.js — page effects
   one-shot scramble + typewriter
   no dependencies
   ======================================== */

/* --- TextScramble (same engine as index, one-shot) --- */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#@';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(function (resolve) {
      this.resolve = resolve;
    }.bind(this));
    this.queue = [];

    for (var i = 0; i < length; i++) {
      var from = oldText[i] || '';
      var to = newText[i] || '';
      var start = Math.floor(Math.random() * 40);
      var end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from: from, to: to, start: start, end: end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    var output = '';
    var complete = 0;

    for (var i = 0, n = this.queue.length; i < n; i++) {
      var item = this.queue[i];
      var from = item.from;
      var to = item.to;
      var start = item.start;
      var end = item.end;
      var char = item.char;

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
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

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

/* --- Typewriter --- */

function typewrite(el, speed) {
  var text = el.getAttribute('data-typewriter');
  var s = speed || 30;
  el.textContent = '';
  el.classList.add('typewriter-active');
  var i = 0;

  function tick() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(tick, s);
    } else {
      el.classList.remove('typewriter-active');
      el.classList.add('typewriter-done');
    }
  }

  tick();
}

/* --- Init on load --- */

document.addEventListener('DOMContentLoaded', function () {

  /* one-shot scramble for page heading */
  var heading = document.querySelector('[data-scramble]');
  if (heading) {
    var text = heading.textContent;
    heading.textContent = '';
    var fx = new TextScramble(heading);
    fx.setText(text);
  }

  /* typewriter for page description */
  var desc = document.querySelector('[data-typewriter]');
  if (desc) {
    var delay = parseInt(desc.getAttribute('data-typewriter-delay') || '500', 10);
    setTimeout(function () {
      typewrite(desc, 28);
    }, delay);
  }
});
