(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  function bindHero() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function play() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        activate(dotIndex);
        play();
      });
    });

    carousel.addEventListener('mouseenter', function () {
      if (timer) {
        window.clearInterval(timer);
      }
    });

    carousel.addEventListener('mouseleave', play);
    activate(0);
    play();
  }

  function bindFilters() {
    var searchInput = document.getElementById('site-search');
    var list = document.querySelector('[data-card-list]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.js-card'));
    var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var empty = document.querySelector('[data-empty-state]');

    if (!cards.length || (!searchInput && !filters.length)) {
      return;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function apply() {
      var term = normalize(searchInput ? searchInput.value : '');
      var activeFilters = {};
      var visible = 0;

      filters.forEach(function (filter) {
        activeFilters[filter.getAttribute('data-filter')] = normalize(filter.value);
      });

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));

        var matched = !term || haystack.indexOf(term) !== -1;

        Object.keys(activeFilters).forEach(function (key) {
          var value = activeFilters[key];
          var cardValue = normalize(card.getAttribute('data-' + key));

          if (value && cardValue.indexOf(value) === -1) {
            matched = false;
          }
        });

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }

      if (list) {
        list.setAttribute('data-visible', String(visible));
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', apply);
    }

    filters.forEach(function (filter) {
      filter.addEventListener('change', apply);
    });

    apply();
  }

  function bindPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.video-shell'));

    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('.play-layer');
      var stream = shell.getAttribute('data-stream');
      var started = false;
      var hls = null;

      if (!video || !stream) {
        return;
      }

      function attach() {
        if (started) {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }

        started = true;
      }

      function start() {
        attach();
        shell.classList.add('is-playing');
        video.controls = true;
        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', start);
      }

      video.addEventListener('click', function () {
        if (!started) {
          start();
        }
      });

      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });

      window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  }

  bindHero();
  bindFilters();
  bindPlayers();
})();
