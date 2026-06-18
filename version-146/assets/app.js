
(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        schedule();
      });
    }

    schedule();
  }

  function initFilter() {
    var form = document.querySelector("[data-filter-form]");
    if (!form) {
      return;
    }
    var input = form.querySelector("[data-filter-input]");
    var yearSelect = form.querySelector('[data-filter-select="year"]');
    var typeSelect = form.querySelector('[data-filter-select="type"]');
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function matchYear(cardYear, selected) {
      if (!selected) {
        return true;
      }
      if (selected === "2022") {
        var numeric = parseInt(cardYear, 10);
        return !Number.isFinite(numeric) || numeric <= 2022;
      }
      return cardYear.indexOf(selected) !== -1;
    }

    function run() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute("data-search") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var cardType = card.getAttribute("data-type") || "";
        var ok = (!query || text.indexOf(query) !== -1) && matchYear(cardYear, year) && (!type || cardType.indexOf(type) !== -1);
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, yearSelect, typeSelect].forEach(function (node) {
      if (!node) {
        return;
      }
      node.addEventListener("input", run);
      node.addEventListener("change", run);
    });
    run();
  }

  function startPlayer(streamUrl) {
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-play-button]");
    if (!video || !button || !streamUrl) {
      return;
    }
    var hlsInstance = null;

    function bind() {
      if (video.getAttribute("data-ready") === "1") {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      video.setAttribute("data-ready", "1");
    }

    function play() {
      bind();
      video.controls = true;
      button.classList.add("is-hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilter();
  });

  window.Site = {
    startPlayer: startPlayer
  };
})();
