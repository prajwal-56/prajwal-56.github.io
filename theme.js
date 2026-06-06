(function () {

  var stored = localStorage.getItem('theme');
  var theme = stored || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', function () {

    var nav = document.querySelector('nav ul');
    if (!nav) return;

    var li = document.createElement('li');
    li.className = 'theme-toggle';

    var btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.textContent = theme === 'dark' ? '☀' : '☾';

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '☀' : '☾';
    });

    li.appendChild(btn);
    nav.appendChild(li);

  });

})();
