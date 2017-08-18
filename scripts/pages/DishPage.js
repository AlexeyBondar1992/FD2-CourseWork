(function () {
    'use strict';
    class DishPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.menu = new RecipesMenu('recipesMenu','navigation');
            this.content = new Dish('dish','content');
            this.footer = new Footer('footer','footer');
        }
    }
    window.DishPage = DishPage;
}());