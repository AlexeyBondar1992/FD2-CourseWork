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
