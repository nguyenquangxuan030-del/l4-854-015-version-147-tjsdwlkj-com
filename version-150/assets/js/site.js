(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function initBackTop() {
    var button = document.querySelector(".back-top");
    if (!button) {
      return;
    }
    var update = function () {
      button.classList.toggle("is-visible", window.scrollY > 360);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var prev = root.querySelector(".hero-prev");
    var next = root.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function initFilters() {
    document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
      var input = scope.querySelector(".js-filter-input");
      var select = scope.querySelector(".js-sort-select");
      var container = scope.querySelector(".js-card-container");
      if (!container) {
        return;
      }
      var cards = Array.prototype.slice.call(container.querySelectorAll(".movie-card"));

      function filterCards() {
        var query = input ? input.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-text") || "").toLowerCase();
          var title = (card.getAttribute("data-title") || "").toLowerCase();
          card.classList.toggle("is-hidden", query && text.indexOf(query) === -1 && title.indexOf(query) === -1);
        });
      }

      function sortCards() {
        if (!select) {
          return;
        }
        var value = select.value;
        var sorted = cards.slice();
        if (value === "views") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
          });
        } else if (value === "year") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          });
        } else if (value === "title") {
          sorted.sort(function (a, b) {
            return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
          });
        }
        sorted.forEach(function (card) {
          container.appendChild(card);
        });
      }

      if (input) {
        input.addEventListener("input", filterCards);
      }
      if (select) {
        select.addEventListener("change", function () {
          sortCards();
          filterCards();
        });
      }
    });
  }

  function initPlayers() {
    document.querySelectorAll(".video-shell").forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector(".play-overlay");
      var stream = shell.getAttribute("data-stream");
      var loaded = false;
      var hlsInstance = null;

      if (!video || !stream) {
        return;
      }

      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else {
          shell.classList.add("is-playing");
        }
      }

      function start() {
        load();
        shell.classList.add("is-playing");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            shell.classList.remove("is-playing");
          });
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          start();
        });
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        shell.classList.add("is-playing");
      });

      video.addEventListener("pause", function () {
        if (video.currentTime < 0.1) {
          shell.classList.remove("is-playing");
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initBackTop();
    initHero();
    initFilters();
    initPlayers();
  });
})();
