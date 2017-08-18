(function () {
    'use strict';
    class Settings extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: 'button[name="addCategory"]',
                    type: 'click',
                    action: function addCategory(event) {
                        let input = document.getElementById('categoryName');
                        if (input.value !== '') {
                            makeRequest('GET', `${URL_BEGIN}/modules/productsCategories/productsCategories.html`, 'text')
                                .then(function (result) {
                                    let div = document.createElement('div');
                                    div.insertAdjacentHTML(`beforeEnd`, result);
                                    let a = div.querySelector('a'),
                                        figcaption,
                                        img;
                                    if (a) {
                                        a.href = `#productsCategories/customCategory`;
                                        img = a.querySelector('img');
                                        figcaption = a.querySelector('figcaption');
                                        img.src = `images/icons/productsCategories/addedByUser.svg`;
                                    }
                                    figcaption.textContent = input.value;
                                    return div.innerHTML;
                                })
                                .then(newCategory => {
                                    let productsCategoriesPage = sessionStorage.getItem('HS.productsCategories');
                                    if (productsCategoriesPage) {
                                        let str = productsCategoriesPage.replace(/<\/div>$/gmi, `${newCategory}</div>`);
                                        sessionStorage.setItem(`HS.productsCategories`, str);
                                        localStorage.setItem(`HS.productsCategories`, str);
                                    } else {
                                        makeRequest("GET", `${URL_BEGIN}/resources/productsCategoriesList.json`, 'json')
                                            .then(result => this.content = new ProductsCategories('productsCategories', 'content', result))
                                            .then(fragment => fragment.loadPageFragment())
                                            .then(div => {
                                                div.insertAdjacentHTML(`beforeEnd`, newCategory);
                                                let container = document.createElement('span');
                                                container.appendChild(div);
                                                sessionStorage.setItem(`HS.productsCategories`, container.innerHTML);
                                                localStorage.setItem(`HS.productsCategories`, container.innerHTML);
                                            });
                                    }
                                    let select = document.querySelector('select');
                                    select.insertAdjacentHTML('beforeEnd', `<option value=${input.value}>${input.value}</option>`);
                                    input.value = '';
                                });
                        }
                    }
                },
                {
                    selector: 'button[name="addProduct"]',
                    type: 'click',
                    action: function addProduct(event) {
                        let input = document.getElementById('productName');
                        if (input.value !== '') {
                            makeRequest('GET', `${URL_BEGIN}/modules/products/products.html`, 'text')
                                .then(function (result) {
                                    let div = document.createElement('div');
                                    div.insertAdjacentHTML(`beforeEnd`, result);
                                    let img = div.querySelector('img'),
                                        figcaption = div.querySelector('figcaption');
                                    if (img) {
                                        img.src = `images/icons/products/addedByUser.svg`;
                                    }
                                    if (figcaption) {
                                        figcaption.textContent = input.value;
                                    }
                                    return div;
                                })
                                .then(newProduct => {
                                    let category = document.querySelector('select').value;
                                    let productsPage = sessionStorage.getItem(`HS.products/${category}`);
                                    if (productsPage) {
                                        let div = document.createElement('div');
                                        div.insertAdjacentHTML('beforeEnd', productsPage);
                                        div.querySelector('#products').insertAdjacentHTML('beforeEnd', newProduct.innerHTML);
                                        let str = div.innerHTML;
                                        sessionStorage.setItem(`HS.products/${category}`, str);
                                        localStorage.setItem(`HS.products/${category}`, str);
                                        input.value = '';
                                    } else {
                                        productsPage = document.createElement('span');
                                        return makeRequest('GET', `${URL_BEGIN}/modules/productsCategories/productsCategories.html`, 'text')
                                            .then(function (result) {
                                                let div = document.createElement('div');
                                                div.setAttribute('id', 'selectedCategory');
                                                div.insertAdjacentHTML(`beforeEnd`, result);
                                                let a = div.querySelector('a'),
                                                    figcaption,
                                                    img;
                                                if (a) {
                                                    a.href = `#productsCategories`;
                                                    img = a.querySelector('img');
                                                    figcaption = a.querySelector('figcaption');
                                                    figcaption.textContent = category;
                                                    return makeRequest("GET", `${URL_BEGIN}/resources/productsCategoriesList.json`, 'json')
                                                        .then(list => {
                                                            let regex = new RegExp(category, 'igm'),
                                                                imageName;
                                                            if (regex.test(list)) {
                                                                imageName = category;
                                                            } else {
                                                                imageName = 'addedByUser';
                                                            }
                                                            img.src = `images/icons/productsCategories/${imageName}.svg`;
                                                            productsPage.appendChild(div);
                                                            console.log(imageName);
                                                            return imageName;
                                                        })
                                                }
                                            })
                                            .then(function (categoryName) {
                                                console.log(categoryName);
                                                return new Promise(function (resolve) {
                                                    if (categoryName === 'addedByUser') {
                                                        newProduct.setAttribute('id', 'products');
                                                        newProduct.setAttribute('data-location', categoryName);
                                                        productsPage.appendChild(newProduct);
                                                        resolve(productsPage.innerHTML);
                                                    } else {
                                                        makeRequest("GET", `${URL_BEGIN}/resources/productsLists/${categoryName}.json`, 'json')
                                                            .then(result => new Products('products', 'content', result))
                                                            .then(fragment => fragment.loadPageFragment(categoryName))
                                                            .then(div => {
                                                                if(div instanceof Node){
                                                                    div.insertAdjacentHTML(`beforeEnd`, newProduct.innerHTML);
                                                                    productsPage.appendChild(div);
                                                                } else {
                                                                    let str = div.replace(/<\/div>$/, `${newProduct.innerHTML}</div>`);
                                                                    productsPage.insertAdjacentHTML('beforeEnd', str);
                                                                }
                                                                resolve(productsPage.innerHTML);
                                                            });
                                                    }
                                                })
                                                    .then(page=>{
                                                        sessionStorage.setItem(`HS.products/${categoryName}`, page);
                                                        localStorage.setItem(`HS.products/${categoryName}`, page);
                                                    });
                                            });
                                    }
                                });
                        }
                    }
                }
            ];
        }

        loadPageFragment(location) {
            return super.loadPageFragment(location).then(function (page) {
                let containerDiv = document.createElement('div');
                containerDiv.innerHTML = page;
                let select = containerDiv.querySelector('select');
                if (sessionStorage.getItem(`HS.productsCategories`)) {
                    let productsCategoriesPage = document.createElement('div');
                    productsCategoriesPage.innerHTML = sessionStorage.getItem(`HS.productsCategories`);
                    let figcaptions = productsCategoriesPage.querySelectorAll('figcaption');
                    for (let i = 0, l = figcaptions.length; i < l; i++) {
                        select.insertAdjacentHTML(`beforeEnd`, `<option value=${figcaptions[i].textContent}>${figcaptions[i].textContent}</option>`)
                    }
                    return containerDiv.innerHTML;
                } else {
                    return makeRequest("GET", 'resources/productsCategoriesList.json', 'json')
                        .then(list => {
                            list.forEach(function (category) {
                                select.insertAdjacentHTML(`beforeEnd`, `<option value=${category}>${category}</option>`);
                            });
                            return containerDiv.innerHTML;
                        });
                }
            });
        }


        destroyPageFragment(location) {
            let pageFragment = document.body.querySelector(`#${this.position}`);
            this.removeListeners();
            pageFragment.innerHTML = '';
        }


    }
    window.Settings = Settings;
}());
