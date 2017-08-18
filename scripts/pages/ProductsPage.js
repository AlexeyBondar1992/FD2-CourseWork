(function () {
    'use strict';
    class ProductsPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.menu = new Menu('menu', 'navigation');
            this.content = makeRequest("GET", `${URL_BEGIN}/resources/productsLists/${this.location}.json`, 'json')
                .then(result => this.content = new Products('products', 'content', result));
            this.footer = new Footer('footer', 'footer');
        }

        load(location) {
            return super.load(location).then(location => {
                let productCategoriesContent = sessionStorage.getItem('HS.productsCategories'),
                    divSelectedCategory = document.createElement('div'),
                    content = window.document.getElementById('content');
                divSelectedCategory.id = 'selectedCategory';
                if (productCategoriesContent) {
                    divSelectedCategory.insertAdjacentHTML(`beforeEnd`, productCategoriesContent);
                    let selectedCategoryHTML = divSelectedCategory.querySelector(`a[href = "#productsCategories/${location}"]`);
                    selectedCategoryHTML.setAttribute('href',"#productsCategories");
                    divSelectedCategory.innerHTML = '';
                    divSelectedCategory.appendChild(selectedCategoryHTML);
                    content.insertAdjacentElement(`afterBegin`, divSelectedCategory);
                }
            });
        }
    }
    window.ProductsPage = ProductsPage;
}());
