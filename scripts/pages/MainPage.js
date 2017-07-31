(function () {
    'use strict';
    class MainPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.menu = new Menu('menu','navigation');
            this.content = new Main('main','content');
            this.footer = new Footer('footer','footer');
        }
        load(){
            return super.load().then(function () {
                let categoriesBtn = window.document.querySelector('#navigation').querySelector('a[href="#main"]'),
                    body = window.document.querySelector('body'),
                    content = window.document.getElementById('content');
                if(categoriesBtn) {
                    categoriesBtn.href = "#productsCategories";
                    categoriesBtn.parentNode.classList.remove('turnedButton');
                }
                body.style.background = 'none';
                content.style.background= 'url(images/refrigerator/2.jpg) no-repeat 50% 50%';
                content.style.backgroundSize = 'contain';
            });
        }
    }
    window.MainPage = MainPage;
}());