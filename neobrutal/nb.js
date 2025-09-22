/* ============================================================
   nb.js — Neobrutalist micro JS library
   Typewriter · Scroll reveal · Easter eggs · Hero parallax
   No frameworks. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Typewriter ────────────────────────────────────── */
  function typewriter(el, phrases, opts = {}) {
    const delay      = opts.delay ?? 80;
    const pause      = opts.pause ?? 1800;
    const eraseDelay = opts.erase ?? 40;
    let pi = 0, ci = 0, erasing = false;

    const caretEl = el.nextElementSibling;
    if (caretEl && caretEl.classList.contains('nb-caret')) {
      caretEl.style.display = 'inline-block';
    }

    function tick() {
      const phrase = phrases[pi];
      if (!erasing) {
        el.textContent = phrase.slice(0, ++ci);
        if (ci >= phrase.length) {
          erasing = true;
          setTimeout(tick, pause);
          return;
        }
        setTimeout(tick, delay);
      } else {
        el.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
          erasing = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, eraseDelay);
      }
    }
    setTimeout(tick, 500);
  }

  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const phrases = el.dataset.typewriter.split('|').map(s => s.trim()).filter(Boolean);
    if (!phrases.length) return;
    el.textContent = '';
    typewriter(el, phrases);
  });

  /* ── 2. Scroll Reveal ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.nb-reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const siblings = e.target.parentElement
            ? [...e.target.parentElement.querySelectorAll('.nb-reveal')]
            : [];
          const idx = siblings.indexOf(e.target);
          e.target.style.transitionDelay = (idx * 80) + 'ms';
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 3. Easter Egg Panels ─────────────────────────────── */
  document.querySelectorAll('.egg-panel').forEach(panel => {
    panel.addEventListener('click', () => {
      const isOpen = panel.classList.contains('open');

      // Close all others first
      document.querySelectorAll('.egg-panel.open').forEach(p => {
        p.classList.remove('open');
        p.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        panel.classList.add('open');
        panel.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 4. Marquee seamless loop ─────────────────────────── */
  document.querySelectorAll('.nb-marquee-inner').forEach(inner => {
    if (!inner.dataset.duped) {
      inner.innerHTML += inner.innerHTML;
      inner.dataset.duped = '1';
    }
  });

  /* ── 5. Nav: jelly pill + active section ─────────────── */
  (function navPill() {
    const linksWrap = document.querySelector('.nb-nav-links');
    if (!linksWrap) return;

    // Create the pill element
    const pill = document.createElement('span');
    pill.className = 'nb-nav-pill';
    pill.setAttribute('aria-hidden', 'true');
    linksWrap.insertBefore(pill, linksWrap.firstChild);

    const navLinks = linksWrap.querySelectorAll('.nb-nav-link');

    // Map link hrefs to section elements
    const sections = [...navLinks]
      .map(l => document.querySelector(l.getAttribute('href')))
      .filter(Boolean);

    // Move pill to an element — instant (no animation) or springy
    function movePill(el, instant) {
      const wrapRect = linksWrap.getBoundingClientRect();
      const elRect   = el.getBoundingClientRect();
      pill.style.transition = instant
        ? 'none'
        : 'left 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease';
      pill.style.left    = (elRect.left - wrapRect.left) + 'px';
      pill.style.width   = elRect.width + 'px';
      pill.style.height  = elRect.height + 'px';
      pill.style.top     = (elRect.top  - wrapRect.top)  + 'px';
      pill.style.opacity = '1';
    }

    function hidePill(instant) {
      pill.style.transition = instant ? 'none' : 'opacity 0.22s ease';
      pill.style.opacity = '0';
    }

    // Find which nav link matches the current scroll position
    function getActiveLink() {
      const scrollY = window.scrollY + 100;
      let activeSection = sections[0];
      sections.forEach(s => { if (s.offsetTop <= scrollY) activeSection = s; });
      const id = activeSection.id;
      return [...navLinks].find(l => l.getAttribute('href') === '#' + id) || null;
    }

    // Snap pill to current active link immediately on load
    requestAnimationFrame(() => {
      const active = getActiveLink();
      if (active) {
        movePill(active, true);
        pill.style.opacity = '0.5'; // resting: slightly dimmed
      }
    });

    let activeLink = getActiveLink();

    // On hover: jump the pill to that link
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        movePill(link, false);
        pill.style.opacity = '1';
        // Text color: hovered link goes dark (pill is yellow)
        navLinks.forEach(l => l.classList.remove('nb-nav-link--active'));
        link.classList.add('nb-nav-link--active');
      });
    });

    // On nav leave: spring back to active section's link
    linksWrap.addEventListener('mouseleave', () => {
      activeLink = getActiveLink();
      navLinks.forEach(l => l.classList.remove('nb-nav-link--active'));
      if (activeLink) {
        movePill(activeLink, false);
        pill.style.opacity = '0.5';
        activeLink.classList.add('nb-nav-link--active');
      } else {
        hidePill(false);
      }
    });

    // On scroll: update pill to track active section
    const onScroll = () => {
      activeLink = getActiveLink();
      navLinks.forEach(l => l.classList.remove('nb-nav-link--active'));
      if (activeLink && !linksWrap.matches(':hover')) {
        movePill(activeLink, false);
        pill.style.opacity = '0.5';
        activeLink.classList.add('nb-nav-link--active');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ── 6. Bliss interlude parallax ─────────────────────── */
  (function blissParallax() {
    const img       = document.getElementById('bliss-img');
    const container = img && img.closest('.bliss-interlude');
    if (!img || !container) return;

    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const rect     = container.getBoundingClientRect();
      const progress = (window.scrollY + window.innerHeight - (container.offsetTop)) /
                       (window.innerHeight + rect.height);
      // Shift image vertically: travels ~15% of its own height
      const offset   = (progress - 0.5) * -15;
      img.style.transform = `translateY(${offset}%)`;
    }, { threshold: Array.from({ length: 20 }, (_, i) => i / 20) });

    io.observe(container);

    // Also drive on scroll for smoother result
    window.addEventListener('scroll', () => {
      if (!container) return;
      const rect     = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = 1 - (rect.top / window.innerHeight);
      const offset   = (progress - 0.5) * -18;
      img.style.transform = `translateY(${offset}%)`;
    }, { passive: true });
  })();

  /* ── 6. Hero sticker parallax ─────────────────────────── */
  (function heroParallax() {
    const sticker = document.querySelector('.hero-sticker');
    const hero    = document.querySelector('.hero');
    if (!sticker || !hero) return;

    // Skip on touch / small screens
    if (window.matchMedia('(max-width: 640px)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf;
    let isHeroVisible = false;

    // Track mouse position relative to hero center
    hero.addEventListener('mousemove', e => {
      const rect  = hero.getBoundingClientRect();
      // Normalize -1 → +1 relative to hero center
      const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      // Translate: moves opposite to cursor (parallax feel), max ±12px
      targetX = -nx * 12;
      // Tilt: slight rotate on Y axis based on X position, subtle
      // Also nudge up slightly when cursor is in upper half
      targetY = -ny * 8;
    });

    hero.addEventListener('mouseleave', () => {
      // Glide back to rest on leave
      targetX = 0;
      targetY = 0;
    });

    // Smooth lerp loop — only runs while hero is in viewport
    const io = new IntersectionObserver(entries => {
      isHeroVisible = entries[0].isIntersecting;
      if (isHeroVisible) startLoop();
    }, { threshold: 0.1 });
    io.observe(hero);

    function startLoop() {
      cancelAnimationFrame(raf);
      loop();
    }

    function loop() {
      if (!isHeroVisible) return;
      raf = requestAnimationFrame(loop);

      const EASE = 0.1; // lower = more lag = more floaty
      currentX += (targetX - currentX) * EASE;
      currentY += (targetY - currentY) * EASE;

      // Combine: translate + very subtle tilt (perspective trick)
      // rotate3d gives a slight lean without a full 3D parent
      sticker.style.transform = [
        `translateX(${currentX.toFixed(2)}px)`,
        `translateY(${currentY.toFixed(2)}px)`,
        `rotate(${(currentX * 0.08).toFixed(3)}deg)`,
      ].join(' ');
    }
  })();

  /* ── 8. Free drag system ──────────────────────────────── */
  (function freeDrag() {
    document.querySelectorAll('.nb-draggable').forEach(el => {
      let isDragging = false;
      let startX, startY, originLeft, originTop;
      let originalParent, originalNextSibling;
      let isDetached = false;

      // Detach to <body> at position:fixed (viewport coords) for smooth drag
      function detach() {
        if (isDetached) return;
        const rect = el.getBoundingClientRect();

        originalParent      = el.parentElement;
        originalNextSibling = el.nextSibling;

        // Ghost keeps layout intact
        const ghost = document.createElement('div');
        ghost.id = '__drag-ghost-' + el.id;
        ghost.style.cssText = `
          width: ${rect.width}px;
          height: ${rect.height}px;
          opacity: 0;
          pointer-events: none;
          flex-shrink: 0;
        `;
        originalParent.insertBefore(ghost, originalNextSibling);

        document.body.appendChild(el);
        el.style.position = 'fixed';
        el.style.left     = rect.left + 'px';
        el.style.top      = rect.top  + 'px';
        el.style.margin   = '0';
        el.style.width    = rect.width + 'px';
        el.style.zIndex   = '9001';

        isDetached = true;
      }

      // On drop: switch from fixed → absolute by adding scroll offset.
      // The image is now anchored to the document, not the viewport.
      function anchorToDocument() {
        const fixedLeft = parseFloat(el.style.left);
        const fixedTop  = parseFloat(el.style.top);
        el.style.position = 'absolute';
        el.style.left     = (fixedLeft + window.scrollX) + 'px';
        el.style.top      = (fixedTop  + window.scrollY) + 'px';
      }

      // If already anchored (absolute), re-lift to fixed for dragging.
      // Read screen position from getBoundingClientRect — always accurate.
      function reliftToFixed() {
        const rect = el.getBoundingClientRect();
        el.style.position = 'fixed';
        el.style.left     = rect.left + 'px';
        el.style.top      = rect.top  + 'px';
      }

      function resetToOrigin() {
        if (!isDetached) return;
        const ghost = document.getElementById('__drag-ghost-' + el.id);
        if (ghost) ghost.remove();
        el.style.cssText = '';
        el.classList.remove('dragging');
        if (originalParent) {
          originalParent.insertBefore(el, originalNextSibling || null);
        }
        isDetached   = false;
        isDragging   = false;
      }

      // ── Pointer events ────────────────────────────────────
      el.addEventListener('pointerdown', e => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        if (!isDetached) {
          detach();
        } else {
          // Already dropped somewhere: re-lift from its absolute position
          reliftToFixed();
        }

        // originLeft/Top are now the fixed (viewport) coords
        originLeft = parseFloat(el.style.left);
        originTop  = parseFloat(el.style.top);

        el.classList.add('dragging');
      });

      el.addEventListener('pointermove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = (originLeft + dx) + 'px';
        el.style.top  = (originTop  + dy) + 'px';
      });

      el.addEventListener('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        el.classList.remove('dragging');
        // Convert to absolute so the image stays put when scrolling
        anchorToDocument();
      });

      // Double-click: snap back
      el.addEventListener('dblclick', () => {
        resetToOrigin();
      });
    });
  })();

  /* ── 9. Konami code easter egg ────────────────────────── */
  const KONAMI = [38,38,40,40,37,39,37,39,66,65];
  let ki = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === KONAMI[ki]) {
      ki++;
      if (ki === KONAMI.length) {
        ki = 0;
        const msg = document.createElement('div');
        msg.style.cssText = `
          position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
          background:var(--black); color:var(--yellow); padding:2rem 3rem;
          border:4px solid var(--yellow); font-family:var(--font-mono);
          font-size:1.2rem; font-weight:700; z-index:9998; text-align:center;
          box-shadow:8px 8px 0 0 var(--yellow);
        `;
        msg.innerHTML = '↑↑↓↓←→←→BA<br><small style="color:#fff;font-size:0.7rem;margin-top:0.5rem;display:block;">you found it. no prize tho.</small>';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      }
    } else {
      ki = 0;
    }
  });

})();
