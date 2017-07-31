(function () {
    'use strict';

    let MODAL_PLACEHOLDER = document.createElement('section');
    MODAL_PLACEHOLDER.classList.add('modal-placeholder');
    class ModalWindow {
        static open(config) {
            return new Promise(function (resolve) {
                let placeholder = MODAL_PLACEHOLDER.cloneNode(true);
                placeholder.innerHTML = getHTML(config);
                placeholder.addEventListener('click', function listener(event) {
                    event.stopPropagation();
                    let target = event.target;
                    if (target.tagName === 'BUTTON' || target.tagName === 'IMG') {
                        placeholder.removeEventListener('click', listener);
                        placeholder.remove();
                        resolve(target.value);
                    }
                });
                document.body.appendChild(placeholder);
            });
        }
    }
    function getHTML(config) {
        return [
            '<div class="modal">',
            `<header><h1>${config.header}</h1><button type="button" class="close-btn" value="close"><img src="images/icons/main/cancel.svg"></button></header>`,
            `<div class="modal-body"><p>${config.body}</p></div>`,
            `<footer>`,
            config.footer.map(function (button) {
                return `<button type="button" value="${button.value}">${button.value}</button>`;
            }).join(''),
            `</footer>`,
            '</div>'
        ].join('');
    }

    window.ModalWindow = ModalWindow;
}());