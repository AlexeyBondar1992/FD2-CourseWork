(function () {
    'use strict';
    class Menu extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: '#missedProducts',
                    type: 'input',
                    action: function rememberCountOfMisssedProducts(event) {
                        let target = event.target;
                        target.setAttribute('value', target.value);
                    }
                }
            ];
        }

    }
    window.Menu = Menu;
}());
