(function () {
    'use strict';
    class RecipesList extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: '.recipes-list',
                    type: 'click',
                    action: function hrefListener(el) {
                        let parentLi,
                        target = el.target;
                        if(target.tagName === 'LI' && target.getAttribute('data-href')){
                            parentLi = target;
                        } else if(target.tagName === 'LI'){
                            parentLi = target.parentNode.closest('li');
                        } else {
                            parentLi = target.closest('li');
                        }
                        if ( parentLi) {
                            sessionStorage.setItem(`HS.recipe_href`,  parentLi.getAttribute('data-href'));
                        }
                        window.location = `${URL_BEGIN}/index.html#dish`;
                    }
                }
            ];

        }

        loadPageFragment(location) {
            let body = window.document.querySelector('body'),
                content = window.document.getElementById('content');
            body.style.background = 'url(images/background2.jpg) no-repeat 50% 90%';
            content.style.background = 'none';
            body.style.backgroundSize = 'cover';
            let moduleName = this.name;
            let mainPage = sessionStorage.getItem(`HS.main`),
                oldMainPage = sessionStorage.getItem(`HS.OldMain`),
                regex = /value="(\d+?)/,
                numberOfMissed = parseInt(sessionStorage.getItem(`HS.menu`).match(regex) ? sessionStorage.getItem(`HS.menu`).match(regex)[1] : 0),
                oldNumberOfMissed = parseInt(sessionStorage.getItem(`HS.oldNumberOfMissed`));
            if (sessionStorage.getItem(`HS.${moduleName}`) && mainPage === oldMainPage && parseInt(numberOfMissed) === parseInt(oldNumberOfMissed)) {
                return new Promise(function (resolve) {
                    resolve(sessionStorage.getItem(`HS.${moduleName}`));
                });
            } else {
                sessionStorage.setItem(`HS.OldMain`, mainPage);
                sessionStorage.setItem(`HS.oldNumberOfMissed`, numberOfMissed);
                let htmlText,
                    ul = document.createElement('ul'),
                    _this = this,
                    PRELOADER = PreLoader.open();
                ul.classList.add('recipes-list');
                makeRequest('GET', `${URL_BEGIN}/modules/${moduleName}/${moduleName}.html`, 'text').then(res => htmlText = res);
                if (mainPage) {
                    regex = /<figcaption>(\w+?)<\/figcaption>/g;
                    let requests = [];
                    this.initialIngredients = mainPage.match(regex) ? mainPage.match(regex).map(function (el) {
                        return el.replace("<figcaption>", '').replace("</figcaption>", '');
                    }) : [];
                    let API_URL = 'http://www.recipepuppy.com/api/?i=' + this.initialIngredients.join(',');
                    for (let i = 1; i < 11; i++) {
                        requests.push(makeRequest('GET', API_URL + `&p=${i}`, 'json'));
                    }
                    return Promise.all(requests)
                        .then(response => {
                            let results = [];
                            for (let i = 0, l = response.length; i < l; i++) {
                                if (response[i]) {
                                    response[i].results.forEach(function (dish) {
                                        let dishIngredients = dish.ingredients = dish.ingredients.split(', ');
                                        if (dishIngredients.length <= _this.initialIngredients.length + numberOfMissed) {
                                            let overlapProducts = dishIngredients.filter(function (ingredient) {
                                                return _this.initialIngredients.some(function (ingr) {
                                                    return ingr === ingredient;
                                                });
                                            });
                                            if (dishIngredients.length <= overlapProducts.length + numberOfMissed) {
                                                results.push(dish);
                                            }
                                        }
                                    });
                                }
                            }
                            return results;
                        })
                        .then(function (result) {
                            ul.id = moduleName;
                            for (let i = 0, length = result.length; i < length; i++) {
                                ul.insertAdjacentHTML(`beforeEnd`, htmlText);
                                let li = ul.children[i],
                                    h1, img, ol;
                                if (li) {
                                    li.dataset.href = result[i].href;
                                    img = li.querySelector('img');
                                    h1 = li.querySelector('h1');
                                    ol = li.querySelector('ol');
                                    ol.textContent = 'Ingredients:';
                                    for (let j = 0, l = result[i].ingredients.length; j < l; j++) {
                                        if (_this.initialIngredients.includes(result[i].ingredients[j].toLowerCase())) {
                                            ol.insertAdjacentHTML(`beforeEnd`, `<li>${result[i].ingredients[j]}</li>`);
                                        } else {
                                            ol.insertAdjacentHTML(`beforeEnd`, `<li class="absent">${result[i].ingredients[j]}</li>`);
                                        }
                                    }
                                    h1.textContent = result[i].title;
                                    if (result[i].thumbnail) {
                                        img.src = result[i].thumbnail;
                                    } else {
                                        img.remove();
                                    }
                                }
                            }
                            if (ul.children.length === 0) {
                                PRELOADER.then(preloader=>{PreLoader.close(preloader)});
                                return (`<ul id="recipesList"><li><p>Dish wasn't found </p></li></ul>`);
                            } else {
                                PRELOADER.then(preloader=>{PreLoader.close(preloader)});
                                return ul;
                            }
                        }).then(res => res);
                } else {
                    return new Promise(function (resolve) {
                        resolve(`<ul id="recipesList"><li><p>Dish wasn't found </p></li></ul>`);
                    });
                }
            }
        }
    }
    window.RecipesList = RecipesList;
}());
