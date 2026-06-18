(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var searchInput = document.querySelector('[data-search-input]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function norm(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyQueryFromUrl() {
    if (!searchInput) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }
    var query = norm(searchInput ? searchInput.value : '');
    var typeValue = norm(typeFilter ? typeFilter.value : '');
    var regionValue = norm(regionFilter ? regionFilter.value : '');
    var visible = 0;

    cards.forEach(function (card) {
      var indexText = norm(card.getAttribute('data-index'));
      var typeText = norm(card.getAttribute('data-type'));
      var regionText = norm(card.getAttribute('data-region'));
      var matched = true;

      if (query && indexText.indexOf(query) === -1) {
        matched = false;
      }
      if (typeValue && typeText !== typeValue) {
        matched = false;
      }
      if (regionValue && regionText !== regionValue) {
        matched = false;
      }

      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : 'block';
    }
  }

  applyQueryFromUrl();

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', filterCards);
  }
  if (regionFilter) {
    regionFilter.addEventListener('change', filterCards);
  }
  filterCards();

  var playerWrap = document.querySelector('.player-wrap');
  var video = document.querySelector('.video-player');
  var playButton = document.querySelector('.player-action');
  var attached = false;

  function attachVideo() {
    if (!video || attached) {
      return;
    }

    var url = video.getAttribute('data-play');
    if (!url) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      attached = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video._hls = hls;
      attached = true;
      return;
    }

    video.src = url;
    attached = true;
  }

  function startPlay() {
    attachVideo();
    if (playerWrap) {
      playerWrap.classList.add('playing');
    }
    if (video) {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }
  }

  if (playButton) {
    playButton.addEventListener('click', startPlay);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (!attached) {
        startPlay();
      }
    });
    video.addEventListener('play', function () {
      if (playerWrap) {
        playerWrap.classList.add('playing');
      }
    });
  }
})();
