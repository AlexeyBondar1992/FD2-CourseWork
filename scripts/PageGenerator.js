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