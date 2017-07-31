(function () {
    'use strict';
    class RecipesListPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.menu = new RecipesMenu('recipesMenu','navigation');
            this.content = new RecipesList('recipesList','content');
            this.footer = new Footer('footer','footer');
        }

    }
    window.RecipesListPage = RecipesListPage;
}());