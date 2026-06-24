/**
 * nav.js — Shared navigation injector
 * Injects nav, controls bar, live clock.
 * Include as first <script> in <body> on every page.
 */
(function () {
  /* ── Page map ── */
  const PAGE_META = {
    '':              { path: '~/',         label: 'home'     },
    'index.html':    { path: '~/',         label: 'home'     },
    'about.html':    { path: '~/about',    label: 'about'    },
    'projects.html': { path: '~/projects', label: 'projects' },
    'contact.html':  { path: '~/contact',  label: 'contact'  },
    'donut.html':    { path: '~/donut',    label: 'donut'    },
  };

  const NAV_LINKS = [
    { href: 'index.html',    label: '~/'         },
    { href: 'about.html',    label: 'about'      },
    { href: 'projects.html', label: 'projects'   },
    { href: 'contact.html',  label: 'contact'    },
  ];

  const filename  = window.location.pathname.split('/').pop() || '';
  const meta      = PAGE_META[filename] || PAGE_META['index.html'];
  const isHome    = filename === '' || filename === 'index.html';
  const hasMatrix = document.getElementById('matrix-canvas') !== null
                    || true; // matrix canvas is always present (injected below)

  /* ── Build nav ── */
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.innerHTML = `
    <div class="nav-left">
      <a href="index.html" class="nav-logo" title="Home">
        <span class="nl-user">prajwal</span><span
          class="nl-at">@127.0.0.1</span><span
          class="nl-sep">:</span><span
          class="nl-path">${meta.path}</span><span
          class="nl-dollar"> $</span>
      </a>
    </div>
    <div class="nav-center">
      <ul id="nav-menu">
        ${NAV_LINKS.map(({ href, label }) => {
          const active = href === filename || (isHome && href === 'index.html');
          return `<li><a href="${href}"${active ? ' class="active"' : ''}>${label}</a></li>`;
        }).join('')}
      </ul>
    </div>
    <div class="nav-right">
      <span class="nav-clock" id="nav-clock"></span>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation"
        aria-expanded="false">☰</button>
    </div>
  `;

  document.body.insertAdjacentElement('afterbegin', nav);

  /* ── Live clock ── */
  function tick() {
    const el = document.getElementById('nav-clock');
    if (!el) return;
    const n = new Date();
    const p = v => String(v).padStart(2, '0');
    el.textContent = `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ── Mobile toggle ── */
  const toggleBtn = document.getElementById('nav-toggle');
  const menu      = document.getElementById('nav-menu');

  function closeMenu() {
    menu.classList.remove('open');
    toggleBtn.textContent = '☰';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggleBtn.textContent = open ? '✕' : '☰';
    toggleBtn.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  /* ── Controls bar ── */
  const controls = document.createElement('div');
  controls.className = 'controls-bar';
  controls.id = 'controls-bar';
  controls.innerHTML = `
    <button class="ctrl-btn" id="matrix-toggle-btn" title="Toggle matrix rain">
      <span class="ctrl-icon" id="matrix-icon">◉</span>
      <span>matrix</span>
    </button>
    ${isHome
      ? `<span class="ctrl-hint">
           <kbd>ctrl+\`</kbd>&nbsp;terminal
         </span>`
      : ''
    }
  `;
  document.body.appendChild(controls);

  /* ── Matrix toggle ──
     matrix.js exposes startMatrix() / stopMatrix() globally.
     We wait for window load so matrix.js has definitely run.        */
  let matrixOn = true;

  function applyMatrixState() {
    const btn  = document.getElementById('matrix-toggle-btn');
    const icon = document.getElementById('matrix-icon');
    const cvs  = document.getElementById('matrix-canvas');
    if (!btn || !icon) return;

    if (matrixOn) {
      if (typeof startMatrix === 'function') startMatrix();
      if (cvs) cvs.classList.remove('off');
      icon.textContent = '◉';
      btn.classList.remove('off');
      btn.title = 'Turn off matrix rain';
    } else {
      if (typeof stopMatrix === 'function') stopMatrix();
      if (cvs) cvs.classList.add('off');
      icon.textContent = '○';
      btn.classList.add('off');
      btn.title = 'Turn on matrix rain';
    }
  }

  window.addEventListener('load', () => {
    const btn = document.getElementById('matrix-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        matrixOn = !matrixOn;
        applyMatrixState();
      });
    }
  });

  /* ── Page title update (nice touch) ── */
  if (document.title && meta.label !== 'home') {
    document.title = `${meta.label} — Prajwal`;
  }

})();
