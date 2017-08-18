(function() {
    let cors_api_host = 'cors-anywhere.herokuapp.com';
    let cors_api_url = 'https://' + cors_api_host + '/';
    let slice = [].slice;
    let origin = window.location.protocol + '//' + window.location.host;
    let open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        let args = slice.call(arguments);
        let targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

(function () {
    'use strict';
    function makeRequest(method, url, type) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = type;
            xhr.open(method, url, true);
            xhr.addEventListener('error', reject);
            xhr.addEventListener('load', function () {
                resolve(xhr.response);
            });
            xhr.send();
        });
    }
    window.makeRequest = makeRequest;
}());


'use strict';
let specOfApplication = {
        "begin": BeginPage,
        "main": MainPage,
        "productsCategories": ProductsCategoriesPage,
        "searchRecipes": RecipesListPage,
        "dish": DishPage,
        /*"settings": SettingsPage*/
    }, productsCategoriesList;
productsCategoriesList = makeRequest("GET", 'resources/productsCategoriesList.json', 'json')
    .then(list =>{
        list.forEach(function (category) {
            specOfApplication[category] = ProductsPage;
        });
        return specOfApplication;
    })
    .then(spec => {
        let router = new Router(specOfApplication);
        router.init();
    });


(function () {
    'use strict';
    class ListLoader extends PageFragment {
        constructor(name, position, list) {
            super(name, position);
            this.list = list;
        }

        /**
         * @returns {Promise}
         */
        loadPageFragment(subcategory) {
            let moduleName = this.name;
            if (localStorage.getItem(`HS.${moduleName}`)) {
                return new Promise(function (resolve) {
                    resolve(localStorage.getItem(`HS.${moduleName}`));
                });
            } else if(localStorage.getItem(`HS.${moduleName}/${subcategory}`)){
                return new Promise(function (resolve) {
                    resolve(localStorage.getItem(`HS.${moduleName}/${subcategory}`));
                });
            } else {
                return makeRequest('GET', `${URL_BEGIN}/modules/${moduleName}/${moduleName}.html`, 'text')
                    .then(function (result) {
                        let div = document.createElement('div');
                        div.id = moduleName;
                        div.dataset.location = subcategory;
                        for (let i = 0, length = this.list.length; i < length; i++) {
                            div.insertAdjacentHTML(`beforeEnd`, result);
                            let a = div.querySelector('a:last-child'),
                                figcaption,
                                img;
                            if (a) {
                                a.href = `#${moduleName}/${this.list[i]}`;
                                img = a.querySelector('img');
                                figcaption = a.querySelector('figcaption');
                                img.src = `images/icons/${moduleName}/${this.list[i]}.svg`;
                            } else {
                                let figure = div.querySelector('figure:last-child');
                                img = figure.querySelector('img');
                                figcaption = figure.querySelector('figcaption');
                                img.src = `images/icons/${moduleName}/${subcategory}/${this.list[i]}.svg`;
                            }
                            figcaption.textContent = this.list[i];
                        }
                        return div;
                    }.bind(this));
            }
        }
    }
    /**
     * @global
     * @class {ListLoader}
     */
    window.ListLoader = ListLoader;
}());

(function () {
    'use strict';
    const MAIN_PICTURE_WIDTH = 536,//px
        MAIN_PICTURE_HEIGHT = 598,//px
        DOOR_IMG_HEIGHT = 559,//px
        MAIN_PICTURE_DIFF = MAIN_PICTURE_HEIGHT / MAIN_PICTURE_WIDTH;


    window.DOOR_IMG_HEIGHT = DOOR_IMG_HEIGHT;
    window.MAIN_PICTURE_DIFF = MAIN_PICTURE_DIFF;
    window. MAIN_PICTURE_WIDTH = MAIN_PICTURE_WIDTH;
    window.MAIN_PICTURE_HEIGHT = MAIN_PICTURE_HEIGHT;

}());


(function () {
    'use strict';

    let MODAL_PLACEHOLDER = document.createElement('section');
    MODAL_PLACEHOLDER.classList.add('modal-placeholder');
    class ModalWindow {
        static open(config) {
            return new Promise(function (resolve) {
                let placeholder = MODAL_PLACEHOLDER.cloneNode(true);
                placeholder.innerHTML = getHTML(config);
                placeholder.addEventListener('click', function listener(event) {
                    event.stopPropagation();
                    let target = event.target;
                    if (target.tagName === 'BUTTON' || target.tagName === 'IMG') {
                        placeholder.removeEventListener('click', listener);
                        placeholder.remove();
                        resolve(target.value);
                    }
                });
                document.body.appendChild(placeholder);
            });
        }
    }
    function getHTML(config) {
        return [
            '<div class="modal">',
            `<header><h1>${config.header}</h1><button type="button" class="close-btn" value="close"><img src="images/icons/main/cancel.svg"></button></header>`,
            `<div class="modal-body"><p>${config.body}</p></div>`,
            `<footer>`,
            config.footer.map(function (button) {
                return `<button type="button" value="${button.value}">${button.value}</button>`;
            }).join(''),
            `</footer>`,
            '</div>'
        ].join('');
    }

    window.ModalWindow = ModalWindow;
}());
(function () {
    'use strict';
    class PageFragment {
        constructor(name, position) {
            this.name = name;
            this.position = position;
            this.Listeners = [];
        }

        loadPageFragment(location) {
            let moduleName = this.name;
            if (localStorage.getItem(`HS.${moduleName}`)) {
                return new Promise(function (resolve) {
                    resolve(localStorage.getItem(`HS.${moduleName}`));
                });
            } else if(localStorage.getItem(`HS.${moduleName}/${location}`)){
                return new Promise(function (resolve) {
                    resolve(localStorage.getItem(`HS.${moduleName}/${location}`));
                });
            } else {
                return makeRequest('GET', `${URL_BEGIN}/modules/${moduleName}/${moduleName}.html`, 'text');
            }
        }

        displayPageFragment(page) {
            return new Promise(function (resolve) {
                if(page instanceof Node) {
                    document.body.querySelector(`#${this.position}`).appendChild(page);
                } else {
                    document.body.querySelector(`#${this.position}`).innerHTML = page;
                }
                this.addListeners();
                resolve (page);
            }.bind(this));
        }
       addListeners() {
        let pageListeners = this.Listeners;
        for (let i = 0, length = pageListeners.length; i < length; i++) {
            if (pageListeners[i].selector === 'window'){
                window.addEventListener(pageListeners[i].type, pageListeners[i].action);
            } else {
                let selectedElement = document.querySelector(pageListeners[i].selector);
                if (selectedElement){
                    selectedElement.addEventListener(pageListeners[i].type, pageListeners[i].action);
                }
            }
        }
    }

        destroyPageFragment(location) {
            let pageFragment = document.body.querySelector(`#${this.position}`);
            if(this.name !== 'products') {
                localStorage.setItem(`HS.${this.name}`, pageFragment.innerHTML);
            } else {
                localStorage.setItem(`HS.${this.name}/${location}`, pageFragment.innerHTML);
            }
            this.removeListeners();
            pageFragment.innerHTML = '';

        }

        removeListeners(){
            let pageListeners = this.Listeners;
            for (let i = 0, length = pageListeners.length; i < length; i++) {
                if (pageListeners[i].selector === 'window'){
                    window.removeEventListener(pageListeners[i].type, pageListeners[i].action);
                } else {
                    let selectedElement = document.querySelector(pageListeners[i].selector);
                    if (selectedElement){
                        selectedElement.removeEventListener(pageListeners[i].type, pageListeners[i].action);
                    }
                }
            }
        }
    }
    window.PageFragment = PageFragment;
}());

(function () {
    'use strict';
    class PageGenerator{
        constructor(location) {
            Object.defineProperty(this, 'location', {
                value:location,
                enumerable: false,
                writable: true,
                configurable: true
            });
        }
        load(){
            let keys = Object.keys(this),promise,
            location = this.location;
            for(let i=0, length=keys.length; i < length; i++){
                let pageFragment = this[keys[i]];
                if (pageFragment instanceof Promise){
                    promise = pageFragment.then(fragment=>
                        fragment.loadPageFragment(location)
                            .then(fragment.displayPageFragment.bind(fragment))
                    );
                } else {
                    promise = pageFragment.loadPageFragment(location)
                        .then(this[keys[i]].displayPageFragment.bind(pageFragment));
                }
            }
            return promise.then(()=>location);
        }
        destroy(){
            let keys = Object.keys(this);
            for(let i=0, length=keys.length; i < length; i++){
                this[keys[i]].destroyPageFragment(this.location);
            }
        }
    }
    window.PageGenerator = PageGenerator;
}());
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
(function () {
    'use strict';
    let url = window.location.href.split('/index.html');
    url.pop();
    const URL_BEGIN = url.join('/');
    window.URL_BEGIN = URL_BEGIN;
}());
