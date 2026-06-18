(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        var source = box.getAttribute('data-src');
        var loaded = false;
        var hls = null;

        function loadSource() {
            if (loaded || !video || !source) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            loaded = true;
        }

        function startPlayback() {
            loadSource();
            if (button) {
                button.hidden = true;
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (button) {
                        button.hidden = false;
                    }
                });
            }
        }

        if (!video || !source) {
            return;
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayback();
            });
        }

        video.addEventListener('click', function () {
            if (!loaded) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            if (button) {
                button.hidden = true;
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
}());
