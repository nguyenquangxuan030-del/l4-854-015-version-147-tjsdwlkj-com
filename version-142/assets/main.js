(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var links = document.querySelector('[data-nav-links]');
    if (!toggle || !links) {
      return;
    }
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero-carousel]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-bg-slide'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-hero-panel]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (!slides.length || !panels.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      panels.forEach(function (panel, i) {
        panel.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  }

  function setupListingFilters() {
    Array.prototype.slice.call(document.querySelectorAll('[data-listing-tools]')).forEach(function (tools) {
      var scope = tools.parentElement;
      var input = tools.querySelector('[data-search-input]');
      var buttons = Array.prototype.slice.call(tools.querySelectorAll('[data-filter]'));
      var count = tools.querySelector('[data-visible-count]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var activeFilter = 'all';

      function apply() {
        var query = normalize(input ? input.value : '');
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta') + ' ' + card.textContent);
          var filterMatch = activeFilter === 'all' || haystack.indexOf(normalize(activeFilter)) !== -1;
          var queryMatch = !query || haystack.indexOf(query) !== -1;
          var show = filterMatch && queryMatch;
          card.classList.toggle('is-hidden', !show);
          if (show) {
            visible += 1;
          }
        });
        if (count) {
          count.textContent = visible + ' 部';
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          buttons.forEach(function (item) {
            item.classList.remove('active');
          });
          button.classList.add('active');
          activeFilter = button.getAttribute('data-filter') || 'all';
          apply();
        });
      });
    });
  }

  function setupGlobalSearch() {
    var input = document.querySelector('[data-global-search]');
    var results = document.querySelector('[data-global-results]');
    var count = document.querySelector('[data-global-count]');
    var data = window.MOVIE_SEARCH_INDEX || [];
    if (!input || !results || !data.length) {
      return;
    }

    function card(item) {
      var tags = (item.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return [
        '<article class="movie-card" data-title="' + escapeHtml(item.title) + '" data-meta="' + escapeHtml(item.meta) + '">',
        '  <a class="poster-link" href="' + escapeHtml(item.url) + '">',
        '    <img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '    <span class="poster-glow"></span>',
        '    <span class="type-badge">' + escapeHtml(item.type) + '</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <a class="movie-title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a>',
        '    <p class="movie-desc">' + escapeHtml(item.oneLine) + '</p>',
        '    <div class="movie-meta"><span>★ ' + escapeHtml(item.rating) + '</span><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function render(list, label) {
      results.innerHTML = list.slice(0, 120).map(card).join('');
      if (count) {
        count.textContent = label;
      }
    }

    input.addEventListener('input', function () {
      var query = normalize(input.value);
      if (!query) {
        render(data.slice(0, 48), '推荐内容');
        return;
      }
      var matched = data.filter(function (item) {
        return normalize(item.title + ' ' + item.meta + ' ' + item.oneLine).indexOf(query) !== -1;
      });
      render(matched, matched.length + ' 个结果');
    });
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupListingFilters();
    setupGlobalSearch();
  });
})();
