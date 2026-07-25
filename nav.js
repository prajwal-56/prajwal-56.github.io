/**
 * nav.js — single source of truth for the site nav.
 * Add / remove tabs here and every page updates automatically.
 */

const NAV_LINKS = [
  { href: 'index.html',    label: 'home'     },
  { href: 'projects.html', label: 'projects' },
  { href: 'blogs.html',    label: 'blog'     },
  { href: 'contact.html',  label: 'contact'  },
  { href: 'socials.html',  label: 'socials'  },
  { href: 'donate.html',   label: 'donate'   },
];

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    // --- detect active page ---
    const currentFile = location.pathname.split('/').pop() || 'index.html';

    // --- build the pill (liquid-glass highlight) ---
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    pill.setAttribute('aria-hidden', 'true');

    const ul = document.createElement('ul');

    NAV_LINKS.forEach(function (link) {
      const isActive = (link.href === currentFile) ||
                       (currentFile === '' && link.href === 'index.html');

      const li = document.createElement('li');
      const a  = document.createElement('a');

      a.href      = link.href;
      a.textContent = link.label;
      if (isActive) a.classList.add('active');

      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(pill);
    nav.appendChild(ul);

    // --- liquid-glass pill movement ---
    const links = ul.querySelectorAll('a');

    function movePillTo(el, instant) {
      const navRect = nav.getBoundingClientRect();
      const elRect  = el.getBoundingClientRect();

      pill.style.transition = instant
        ? 'none'
        : 'left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease';

      pill.style.left    = (elRect.left - navRect.left) + 'px';
      pill.style.width   = elRect.width + 'px';
      pill.style.height  = elRect.height + 'px';
      pill.style.top     = (elRect.top - navRect.top) + 'px';
      pill.style.opacity = '1';
    }

    function hidePill(instant) {
      pill.style.transition = instant ? 'none' : 'opacity 0.25s ease';
      pill.style.opacity = '0';
    }

    // Snap pill to active link on load (no animation)
    const activeLink = ul.querySelector('a.active');
    if (activeLink) {
      // Wait one frame for layout to settle
      requestAnimationFrame(function () {
        movePillTo(activeLink, true);
        // Then make it slightly visible as a subtle "you are here" indicator
        pill.style.opacity = '0.35';
      });
    }

    let isHovering = false;

    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        isHovering = true;
        movePillTo(a, false);
        pill.style.opacity = '1';
      });
    });

    nav.addEventListener('mouseleave', function () {
      isHovering = false;
      // Return pill to active link, or hide it if none
      if (activeLink) {
        movePillTo(activeLink, false);
        pill.style.opacity = '0.35';
      } else {
        hidePill(false);
      }
    });

    // --- click ripple effect ---
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        // Don't ripple on the active page (it's staying put)
        const ripple = document.createElement('span');
        ripple.className = 'nav-ripple';

        const rect = a.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = x + 'px';
        ripple.style.top  = y + 'px';

        a.appendChild(ripple);

        ripple.addEventListener('animationend', function () {
          ripple.remove();
        });
      });
    });
  });
})();
