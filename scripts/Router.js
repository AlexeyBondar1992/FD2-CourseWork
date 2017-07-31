(function () {
    'use strict';
    class Router {
        constructor(spec) {
            this.spec = spec;
        }

        init() {
            let location = locationListener();
            let Page,
                page,
                _this = this;
            loadPageByHash(location);
            window.addEventListener('hashchange', function () {
                event.preventDefault();
                page.destroy();
                location = locationListener();
                loadPageByHash(location);
            });
            function locationListener() {
                let location = window.location.hash.replace('#', '');
                if (!location) {
                    return 'begin';
                } else {
                    if (location.search(/\//)) {
                        return location.split('/').pop();
                    } else {
                        return location;
                    }
                }
            }
            function loadPageByHash(location) {
                Page = _this.spec[location];
                if (Page) {
                    page = new Page(location);
                }
                page.load();
            }
        }
    }
    window.Router = Router;
}());