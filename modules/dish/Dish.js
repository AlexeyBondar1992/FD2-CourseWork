(function () {
    'use strict';
    class Dish extends PageFragment {
        constructor(...args) {
            super(...args);
        }

        loadPageFragment(location) {
            let body = window.document.querySelector('body'),
                content = window.document.getElementById('content');
            body.style.background = 'url(images/background2.jpg) no-repeat 50% 90%';
            content.style.background = 'none';
            body.style.backgroundSize = 'cover';
            let moduleName = this.name;
            let href = sessionStorage.getItem(`HS.recipe_href`),
                oldHref = sessionStorage.getItem(`HS.recipe_old_href`);
            if (sessionStorage.getItem(`HS.${moduleName}`) && href === oldHref) {
                return new Promise(function (resolve) {
                    resolve(sessionStorage.getItem(`HS.${moduleName}`));
                });
            } else {
                sessionStorage.setItem(`HS.recipe_old_href`, href);
                let contentDiv = document.createElement('div'),
                    resourceName = href.split('/')[2],
                    resourcePage = contentDiv.cloneNode(true),
                    _this = this,
                    PRELOADER = PreLoader.open();
                contentDiv.id = 'dish';
                makeRequest('GET', `${URL_BEGIN}/modules/${moduleName}/${moduleName}.html`, 'text').then(res => contentDiv.insertAdjacentHTML(`beforeEnd`, res));
                return makeRequest('GET', href, 'text').then(result => {
                    if(result){
                        resourcePage.insertAdjacentHTML(`beforeEnd`, result);
                        let h1 = contentDiv.querySelector('h1'),
                            p = contentDiv.querySelector('p'),
                            img = contentDiv.querySelector('img'),
                            ingredients = contentDiv.querySelector('#ingredients'),
                            preparation = contentDiv.querySelector('#preparation');
                        if(resourceName === 'www.eatingwell.com'){//работал но лег кроссдомен(((
                            h1.innerHTML = resourcePage.querySelector('h3.recipeDetailHeader').innerHTML;
                            img.src = resourcePage.querySelector('.recipeDetailSummaryImage a').getAttribute('href');
                            p.innerHTML = resourcePage.querySelector('.recipeSubmitter p').getAttribute('title');
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.recipeIngredients li'), function (item) {
                                let span = item.querySelector('span');
                                if (span.getAttribute('itemprop') === 'ingredients'){
                                    ingredients.insertAdjacentHTML(`beforeEnd`, `<li class='ingredients'>${span.innerHTML}</li>`);
                                }
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.step'), function (item) {
                                preparation.appendChild(item);
                            });
                        } else if(resourceName === 'www.recipezaar.com'|| resourceName === 'www.food.com'){//не работает
                            h1.innerHTML = resourcePage.querySelector('header.recipe h1').innerHTML;
                            img.src = resourcePage.querySelector('.recipe-main-img').getAttribute('src');
                            /*p.innerHTML = resourcePage.querySelector('.recipeSubmitter p').getAttribute('title');*/
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.ingredient-list li'), function (item) {
                                ingredients.appendChild(item);
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.directions li'), function (item) {
                                preparation.appendChild(item);
                            });
                        } else if(resourceName === 'allrecipes.com'){//работает стабильно
                            h1.innerHTML = resourcePage.querySelector('.recipe-summary__h1')?resourcePage.querySelector('.recipe-summary__h1').innerHTML:'';
                            img.src = resourcePage.querySelector('#BI_openPhotoModal1')?resourcePage.querySelector('#BI_openPhotoModal1').getAttribute('src'):'';
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.recipe-container-outer li.checkList__line'), function (item) {
                                let span = item.querySelector('span.added');
                                if (span && !span.classList.contains('white')){
                                    ingredients.insertAdjacentHTML(`beforeEnd`, `<li class='ingredients'>${span.innerHTML}</li>`);
                                }
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('ol.recipe-directions__list li.step'), function (item) {
                                let span = item.querySelector('span');
                                if (span && !span.getAttribute('ng-bind')){
                                    preparation.insertAdjacentHTML(`beforeEnd`, `<li class='steps'>${span.innerHTML}</li>`);
                                }
                            });
                        } else if(resourceName === 'www.grouprecipes.com'){//работает стабильно
                            h1.innerHTML = resourcePage.querySelector('h1.fn')?resourcePage.querySelector('h1.fn').innerHTML:'';
                            img.src = resourcePage.querySelector('.zoom')?resourcePage.querySelector('.zoom').getAttribute('src'):'';
                            p.innerHTML = resourcePage.querySelector('div.details p').textContent;
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('div.ingredients li'), function (item) {
                                item.querySelector('.to_shopping_list.to_list ').remove();
                                ingredients.appendChild(item);
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('div.how .instructions li'), function (item) {
                               preparation.appendChild(item);
                            });
                            preparation.style.ListStyleType = 'none';

                        } else if(resourceName === 'www.epicurious.com'){//работает стабильно
                            h1.innerHTML = resourcePage.querySelector('div.title-source h1')?resourcePage.querySelector('div.title-source h1').innerHTML:'';
                            let imgContainer = resourcePage.querySelector('img.photo.loaded');
                            if(imgContainer){
                                let src = imgContainer.getAttribute('srcset');
                                img.src = 'http:'+ src;
                            }
                            p.innerHTML = resourcePage.querySelector('div.dek p')?resourcePage.querySelector('div.dek p').textContent:'';
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('ol.ingredient-groups li.ingredient'), function (item) {
                                ingredients.appendChild(item);
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('ol.preparation-steps li.preparation-step'), function (item) {
                                preparation.appendChild(item);
                            });
                        } else if(resourceName === 'www.nibbledish.com'){//работает стабильно
                            h1.innerHTML = resourcePage.querySelector('h1.subheading')?resourcePage.querySelector('h1.subheading').innerHTML:'';
                            let imgContainer = resourcePage.querySelector('#recipe_pic_new img');
                            if(imgContainer){
                                let src = imgContainer.getAttribute('src').split('/');
                                img.src = 'http://www.nibbledish.com/public/images/recipe_images/'+ src[src.length-1];
                            }
                            p.innerHTML = resourcePage.querySelector('#method_inner p')?resourcePage.querySelector('#method_inner p').textContent:'';
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('#recipe_ingredients li'), function (item) {
                                ingredients.appendChild(item);
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('#method_inner ol li'), function (item) {
                                preparation.appendChild(item);
                            });
                        } else if(resourceName === 'cookeatshare.com'){
                            h1.innerHTML = resourcePage.querySelector('#content h1')?resourcePage.querySelector('#content h1').textContent:'';
                            h1.innerHTML.replace('Рецепт ','');
                            let imgContainer = resourcePage.querySelector('img.obj-pic');
                            if(imgContainer){
                                img.src = imgContainer.getAttribute('src');
                            }
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('li.ingredient'), function (item) {
                                let span = item.querySelector('span');
                                if (span){
                                    ingredients.insertAdjacentHTML(`beforeEnd`, `<li class='ingredients'>${span.innerHTML}</li>`);
                                }
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('#directions li'), function (item) {
                                let span = item.querySelector('span');
                                if (span){
                                    preparation.insertAdjacentHTML(`beforeEnd`, `<li class='steps'>${span.innerHTML}</li>`);
                                }
                            });
                        } else if(resourceName === 'www.kraftfoods.com'){
                            console.log(resourcePage);
                        } else if(resourceName === 'www.cooks.com'){
                            console.log(resourcePage);
                            h1.innerHTML = resourcePage.querySelector('.title span')?resourcePage.querySelector('.title span').textContent:'';
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.ingredient'), function (item) {
                                    ingredients.insertAdjacentHTML(`beforeEnd`, `<li class='ingredients'>${item.innerHTML}</li>`);
                            });
                            Array.prototype.forEach.call(resourcePage.querySelectorAll('.instructions'), function (item) {
                                    preparation.insertAdjacentHTML(`beforeEnd`, `<li class='steps'>${item.innerHTML}</li>`);
                            });
                        } else {
                            PRELOADER.then(preloader => {
                                PreLoader.close(preloader)
                            });
                            return 'Unknown Server'
                        }
                        PRELOADER.then(preloader => {
                            PreLoader.close(preloader)
                        });
                        return contentDiv;
                    } else {
                        PRELOADER.then(preloader => {
                            PreLoader.close(preloader)
                        });
                        return 'Server Error'
                    }
                });
            }
        }
    }
    window.Dish = Dish;
}());
