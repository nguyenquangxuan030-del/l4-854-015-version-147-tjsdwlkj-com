(function () {
  function loadScript(src, callback) {
    var existing = document.querySelector('script[data-hls-loader]');
    if (existing) {
      existing.addEventListener('load', callback, { once: true });
      if (window.Hls) {
        callback();
      }
      return;
    }
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('data-hls-loader', 'true');
    script.onload = callback;
    document.head.appendChild(script);
  }

  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play]');
    var status = shell.querySelector('[data-status]');
    var source = shell.getAttribute('data-video');
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function playNative() {
      video.src = source;
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          setStatus('请再次点击播放');
        });
      }
    }

    function attachHls() {
      if (window.Hls && window.Hls.isSupported()) {
        if (hls) {
          hls.destroy();
        }
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('正在播放');
          playNative();
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            setStatus('播放源加载异常，已切换浏览器播放');
            if (hls) {
              hls.destroy();
              hls = null;
            }
            playNative();
          }
        });
      } else {
        setStatus('浏览器原生播放');
        playNative();
      }
    }

    button.addEventListener('click', function () {
      button.classList.add('is-hidden');
      setStatus('正在加载播放源');
      video.controls = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        playNative();
      } else if (window.Hls) {
        attachHls();
      } else {
        loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js', attachHls);
      }
    });
  }

  if (document.readyState !== 'loading') {
    Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(setupPlayer);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(setupPlayer);
    });
  }
})();
