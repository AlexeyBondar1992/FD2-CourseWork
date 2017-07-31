(function () {
    'use strict';
    class ProductsCategoriesPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.menu = new Menu('menu', 'navigation');
            this.content = makeRequest("GET", `${URL_BEGIN}/resources/productsCategoriesList.json`, 'json')
                .then(result => this.content = new ProductsCategories('productsCategories', 'content', result));
            this.footer = new Footer('footer', 'footer');
        }

        load() {
            return super.load().then(function () {
                let mainBtn = window.document.querySelector('a[href="#productsCategories"]'),
                    body = window.document.querySelector('body'),
                    content = window.document.getElementById('content');
                if (mainBtn) {
                    mainBtn.href = "#main";
                    mainBtn.parentNode.classList.add('turnedButton');
                }
                body.style.background = 'url(images/background2.jpg) no-repeat 50% 90%';
                content.style.background = 'none';
                body.style.backgroundSize = 'cover';
            });
        }
    }
    window.ProductsCategoriesPage = ProductsCategoriesPage;
}());
