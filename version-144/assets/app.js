(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var links = document.querySelector("[data-nav-links]");
        if (!toggle || !links) {
            return;
        }
        toggle.addEventListener("click", function () {
            links.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        if (slides.length < 2) {
            return;
        }
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var nextButton = document.querySelector("[data-hero-next]");
        var prevButton = document.querySelector("[data-hero-prev]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var nextIndex = parseInt(dot.getAttribute("data-hero-dot"), 10) || 0;
                show(nextIndex);
                restart();
            });
        });

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }

        restart();
    }

    function getUrlQuery() {
        var params = new URLSearchParams(window.location.search);
        return params.get("q") || "";
    }

    function setupFilter() {
        var scope = document.querySelector("[data-filter-scope]");
        if (!scope) {
            return;
        }
        var input = scope.querySelector("[data-filter-input]");
        var year = scope.querySelector("[data-filter-year]");
        var type = scope.querySelector("[data-filter-type]");
        var category = scope.querySelector("[data-filter-category]");
        var count = scope.querySelector("[data-filter-count]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".search-card"));
        var queryFromUrl = getUrlQuery();

        if (input && queryFromUrl) {
            input.value = queryFromUrl;
        }

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function matches(card, query, selectedYear, selectedType, selectedCategory) {
            var haystack = [
                card.getAttribute("data-title"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year")
            ].join(" ").toLowerCase();
            var okQuery = !query || haystack.indexOf(query) !== -1;
            var okYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
            var cardType = card.getAttribute("data-type") || "";
            var okType = !selectedType || cardType.indexOf(selectedType) !== -1;
            var okCategory = !selectedCategory || card.getAttribute("data-category") === selectedCategory;
            return okQuery && okYear && okType && okCategory;
        }

        function apply() {
            var query = normalize(input ? input.value : "");
            var selectedYear = year ? year.value : "";
            var selectedType = type ? type.value : "";
            var selectedCategory = category ? category.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var show = matches(card, query, selectedYear, selectedType, selectedCategory);
                card.classList.toggle("is-hidden", !show);
                if (show) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = "符合条件：" + visible;
            }
        }

        [input, year, type, category].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        apply();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilter();
    });
})();
