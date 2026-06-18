(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.hls-player'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-player-toggle]');
      var status = player.querySelector('[data-player-status]');
      var src = player.getAttribute('data-src');
      var hls = null;

      if (!video || !src) {
        return;
      }

      function setStatus(text) {
        if (status) {
          status.textContent = text;
        }
      }

      function attachSource() {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus('视频已就绪');
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus('播放源连接异常');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          setStatus('视频已就绪');
        } else {
          video.src = src;
          setStatus('点击播放');
        }
      }

      function togglePlay() {
        if (video.paused) {
          var playPromise = video.play();

          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
              setStatus('请再次点击播放');
            });
          }
        } else {
          video.pause();
        }
      }

      attachSource();

      if (button) {
        button.addEventListener('click', togglePlay);
      }

      video.addEventListener('click', togglePlay);
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
        setStatus('正在播放');
      });
      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
        setStatus('已暂停');
      });
      video.addEventListener('ended', function () {
        player.classList.remove('is-playing');
        setStatus('播放结束');
      });

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
