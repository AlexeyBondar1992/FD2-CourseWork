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
            if (sessionStorage.getItem(`HS.${moduleName}`)) {
                return new Promise(function (resolve) {
                    resolve(sessionStorage.getItem(`HS.${moduleName}`));
                });
            } else if(sessionStorage.getItem(`HS.${moduleName}/${location}`)){
                return new Promise(function (resolve) {
                    resolve(sessionStorage.getItem(`HS.${moduleName}/${location}`));
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
                sessionStorage.setItem(`HS.${this.name}`, pageFragment.innerHTML);
            } else {
                sessionStorage.setItem(`HS.${this.name}/${location}`, pageFragment.innerHTML);
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
