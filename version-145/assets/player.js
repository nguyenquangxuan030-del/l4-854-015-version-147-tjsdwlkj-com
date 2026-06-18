const MoviePlayer = (function () {
  function init(src, videoId, buttonId) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);

    if (!video || !src) {
      return;
    }

    let attached = false;

    function attach() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function start() {
      attach();

      if (button) {
        button.classList.add('is-hidden');
      }

      const attempt = video.play();

      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!attached) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }

  return {
    init: init
  };
})();
