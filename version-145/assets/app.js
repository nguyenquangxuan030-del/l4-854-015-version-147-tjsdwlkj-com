(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const areas = document.querySelectorAll('[data-filter-area]');

  areas.forEach(function (area) {
    const input = area.querySelector('[data-filter-input]');
    const region = area.querySelector('[data-filter-region]');
    const type = area.querySelector('[data-filter-type]');
    const grid = area.nextElementSibling;
    const empty = area.querySelector('[data-empty-state]');

    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll('[data-movie-card]'));

    function applyFilter() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const selectedRegion = region ? region.value.trim() : '';
      const selectedType = type ? type.value.trim() : '';
      let visible = 0;

      cards.forEach(function (card) {
        const title = card.getAttribute('data-title') || '';
        const cardRegion = card.getAttribute('data-region') || '';
        const cardType = card.getAttribute('data-type') || '';
        const matchKeyword = !keyword || title.indexOf(keyword) !== -1;
        const matchRegion = !selectedRegion || cardRegion.indexOf(selectedRegion) !== -1;
        const matchType = !selectedType || cardType.indexOf(selectedType) !== -1;
        const matched = matchKeyword && matchRegion && matchType;

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (region) {
      region.addEventListener('change', applyFilter);
    }

    if (type) {
      type.addEventListener('change', applyFilter);
    }
  });
})();
