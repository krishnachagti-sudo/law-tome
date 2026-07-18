// Shared across all Law Tome pages: theme persistence + toggle.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('lt-theme'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');

  function wire() {
    var btn = document.getElementById('theme');
    // Which glyph shows (moon vs sun) is driven purely by CSS keyed on
    // <html data-theme>, so there's no icon to repaint here — just flip the theme.
    if (btn) btn.onclick = function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('lt-theme', next); } catch (e) {}
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
