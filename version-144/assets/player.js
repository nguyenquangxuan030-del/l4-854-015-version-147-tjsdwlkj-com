(function () {
    function setupHlsPlayer(options) {
        var video = document.querySelector(options.videoSelector);
        var overlay = document.querySelector(options.overlaySelector);
        var button = document.querySelector(options.buttonSelector);
        var hls = null;
        var attached = false;

        if (!video) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = options.url;
                attached = true;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(options.url);
                hls.attachMedia(video);
                attached = true;
                return;
            }
            video.src = options.url;
            attached = true;
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function start() {
            attach();
            hideOverlay();
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        attach();

        if (overlay) {
            overlay.addEventListener("click", start);
        }
        if (button) {
            button.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", hideOverlay);
        video.addEventListener("ended", function () {
            if (overlay) {
                overlay.classList.remove("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.setupHlsPlayer = setupHlsPlayer;
})();
