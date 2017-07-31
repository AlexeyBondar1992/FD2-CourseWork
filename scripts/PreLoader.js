(function () {
    'use strict';

    let PRELOADER = document.createElement('div');
    PRELOADER.classList.add('page-preloader');
    class PreLoader{
        static open() {
            return new Promise(function (resolve) {
                let preLoader = PRELOADER.cloneNode(true);
                preLoader.innerHTML = `<span class="spinner"></span>`;
                document.body.appendChild(preLoader);
                resolve(preLoader);
            });
        }
        static close(preLoader) {
            preLoader.remove();
        }
    }
    window.PreLoader = PreLoader;
}());