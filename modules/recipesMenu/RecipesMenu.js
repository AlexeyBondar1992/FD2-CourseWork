(function () {
    'use strict';
    class RecipesMenu extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: '#back',
                    type: 'click',
                    action: function back() {
                        history.back();
                    }
                }
            ]
        }

    }
    window.RecipesMenu = RecipesMenu;
}());
