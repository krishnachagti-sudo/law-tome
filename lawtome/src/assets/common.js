// Shared across all Law Tome pages: theme persistence + toggle.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('lt-theme'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');

  function wire() {
    var btn = document.getElementById('theme');
    var ico = document.getElementById('th-ico');
    function paint() { if (ico) ico.textContent = root.getAttribute('data-theme') === 'dark' ? '☀' : '☾'; }
    paint();
    if (btn) btn.onclick = function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('lt-theme', next); } catch (e) {}
      paint();
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
