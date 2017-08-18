(function () {
    'use strict';
    class SettingsMenu extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: '#settingsMenu',
                    type: 'click',
                    action: function show(event) {
                        setTimeout(function () {
                            let li = event.target.closest('li');
                            if (li) {
                                li.classList.toggle('turnedButton');
                                let selector = li.getAttribute('data-id');
                                let addSelected = document.querySelector(`#${selector}`);
                                addSelected.classList.toggle('active');
                                if (selector === 'addCategory') {
                                    document.getElementById('addProduct').classList.remove('active');
                                    document.querySelector('li[data-id="addProduct"]').classList.remove('turnedButton');
                                } else if (selector === 'addProduct') {
                                    document.getElementById('addCategory').classList.remove('active');
                                    document.querySelector('li[data-id="addCategory"]').classList.remove('turnedButton');
                                }
                            }
                        }, 100);
                    }
                },
            ];
        }
        destroyPageFragment(location) {
            let pageFragment = document.body.querySelector(`#${this.position}`);
            this.removeListeners();
            pageFragment.innerHTML = '';
        }
    }
    window.SettingsMenu = SettingsMenu;
}());
