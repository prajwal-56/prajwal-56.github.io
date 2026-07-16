/**
 * typewriter.js — Terminal command typewriter effect
 * Animates .tc-command elements to look like they're being typed live.
 * Uses IntersectionObserver so the animation fires when the element enters the viewport.
 */
(function () {
  function typeCommand(el) {
    const full = el.dataset.cmd;
    el.textContent = '';

    let i = 0;
    function next() {
      if (i < full.length) {
        el.textContent += full[i++];
        // Realistic feel: pause slightly longer on spaces
        const ch = full[i - 1];
        const delay = ch === ' ' ? 110 : 38 + Math.random() * 52;
        setTimeout(next, delay);
      } else {
        // Keep cursor blinking for 2s then let it settle (stays visible but stops animating)
        const cursor = el.nextElementSibling;
        if (cursor && cursor.classList.contains('tc-cursor')) {
          setTimeout(() => cursor.classList.add('done'), 2200);
        }
      }
    }

    // Brief pause before typing starts — feels like the shell just got focus
    setTimeout(next, 320);
  }

  function init() {
    const elements = document.querySelectorAll('.tc-command');
    if (!elements.length) return;

    // Stash the text and clear the element before observing
    elements.forEach(el => {
      el.dataset.cmd = el.textContent.trim();
      el.textContent = '';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeCommand(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    elements.forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
