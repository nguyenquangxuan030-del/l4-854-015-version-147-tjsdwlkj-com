(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;

      function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
      });

      window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    var roots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));

    roots.forEach(function (root) {
      var input = root.querySelector('[data-filter-input]');
      var yearSelect = root.querySelector('[data-filter-year]');
      var categorySelect = root.querySelector('[data-filter-category]');
      var count = root.querySelector('[data-filter-count]');
      var list = document.querySelector('[data-filter-list]');

      if (!list) {
        return;
      }

      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      function applyFilter() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var category = categorySelect ? categorySelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = [
            card.dataset.title,
            card.dataset.year,
            card.dataset.region,
            card.dataset.type,
            card.dataset.genre
          ].join(' ').toLowerCase();

          var yearMatches = true;

          if (year === '2021') {
            var numericYear = Number(card.dataset.year || 0);
            yearMatches = numericYear > 0 && numericYear <= 2021;
          } else if (year) {
            yearMatches = card.dataset.year === year;
          }

          var categoryMatches = !category || card.dataset.category === category;
          var queryMatches = !query || text.indexOf(query) !== -1;
          var shouldShow = yearMatches && categoryMatches && queryMatches;

          card.style.display = shouldShow ? '' : 'none';

          if (shouldShow) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '显示 ' + visible + ' 部';
        }
      }

      [input, yearSelect, categorySelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilter);
          control.addEventListener('change', applyFilter);
        }
      });

      applyFilter();
    });

    var searchApp = document.querySelector('[data-search-app]');

    if (searchApp && window.MOVIES) {
      var searchInput = searchApp.querySelector('[data-search-input]');
      var searchCategory = searchApp.querySelector('[data-search-category]');
      var searchCount = searchApp.querySelector('[data-search-count]');
      var results = searchApp.querySelector('[data-search-results]');
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q') || '';

      if (searchInput) {
        searchInput.value = initialQuery;
      }

      function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
          return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return '' +
          '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-year="' + escapeHtml(movie.year) + '" data-region="' + escapeHtml(movie.region) + '" data-type="' + escapeHtml(movie.type) + '" data-genre="' + escapeHtml(movie.genre) + '" data-category="' + escapeHtml(movie.category_slug) + '">' +
            '<a class="poster-link" href="' + escapeHtml(movie.detail_url) + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
              '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
              '<span class="play-mark">▶</span>' +
            '</a>' +
            '<div class="movie-card-body">' +
              '<div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
              '<h3><a href="' + escapeHtml(movie.detail_url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
              '<p>' + escapeHtml(movie.one_line || movie.summary || '') + '</p>' +
              '<div class="tag-row">' + tags + '</div>' +
              '<div class="card-bottom"><span class="rating">★ ' + escapeHtml(movie.rating) + '</span><a href="' + escapeHtml(movie.detail_url) + '">立即观看</a></div>' +
            '</div>' +
          '</article>';
      }

      function escapeHtml(value) {
        return String(value || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function applySearch() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var category = searchCategory ? searchCategory.value : '';
        var found = window.MOVIES.filter(function (movie) {
          var text = [
            movie.title,
            movie.region,
            movie.type,
            movie.year,
            movie.genre,
            (movie.tags || []).join(' '),
            movie.one_line,
            movie.summary
          ].join(' ').toLowerCase();

          return (!query || text.indexOf(query) !== -1) && (!category || movie.category_slug === category);
        }).slice(0, 240);

        if (results) {
          results.innerHTML = found.map(movieCard).join('');
        }

        if (searchCount) {
          searchCount.textContent = '找到 ' + found.length + ' 部';
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', applySearch);
      }

      if (searchCategory) {
        searchCategory.addEventListener('change', applySearch);
      }

      applySearch();
    }
  });
})();
