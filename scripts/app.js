'use strict';
let specOfApplication = {
        "begin": BeginPage,
        "main": MainPage,
        "productsCategories": ProductsCategoriesPage,
        "searchRecipes": RecipesListPage
       /* "dishes": DishesPage,
        "settings": SettingsPage*/
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

