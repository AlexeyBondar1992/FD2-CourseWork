(function () {
    'use strict';
    class Main extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: '#main',
                    type: 'click',
                    action: function addProductToList(el) {
                        let elementClicked = el.target.closest('figure');
                        if (elementClicked) {
                            let refrigiratorContent = sessionStorage.getItem(`HS.products/${elementClicked.getAttribute('data-category')}`);
                            let str = refrigiratorContent.replace(/<\/div>$/gmi, `<figure>${elementClicked.innerHTML}</figure></div>`);
                            sessionStorage.setItem(`HS.products/${elementClicked.getAttribute('data-category')}`, str);
                            elementClicked.remove();
                        }
                    }
                },
                {selector: 'window',
                    type: 'resize',
                    action: this.screenWidthListener
                }
            ];

        }

        screenWidthListener(page) {
            let mainContainer = document.getElementById('main'),
                nav = document.getElementById('navigation'),
                screenWidth = document.body.clientWidth,
                screenHeight = document.body.clientHeight - 2 * nav.offsetHeight,
                diff = screenHeight / screenWidth;
            if (MAIN_PICTURE_DIFF <= diff) {
                mainContainer.classList.remove('positions-2');
                mainContainer.classList.add('positions-1');
            } else {
                mainContainer.classList.remove('positions-1');
                mainContainer.classList.add('positions-2');
            }
            return page;
        }
        displayPageFragment(page) {
            return super.displayPageFragment(page)
                .then(this.screenWidthListener(page))
        }
    }
    window.Main = Main;
}());