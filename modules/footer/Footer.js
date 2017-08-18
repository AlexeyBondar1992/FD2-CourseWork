(function () {
    'use strict';
    class Footer extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: '#clear',
                    type: 'click',
                    action: function clear() {
                        let MODAL = ModalWindow.open({
                            header: ' ',
                            body: 'Do you want clear?',
                            footer: [
                                {
                                    label: 'Yes',
                                    value: 'Yes'
                                },
                                {
                                    label: 'No',
                                    value: 'No'
                                }
                            ]
                        }).then(function (value) {
                            if(value === 'Yes'||value === 'yes'){
                                sessionStorage.clear();
                                let main = document.getElementById('main'),
                                    settingsBtn = document.querySelector('a[href="#settings"]');
                                settingsBtn.parentNode.classList.remove('turnedButton');
                                if (main) {
                                    main.innerHTML = '';
                                }
                                window.location = `${URL_BEGIN}/index.html#main`;
                            }
                        });
                    }
                }
            ];
        }
    }
    window.Footer = Footer;
}());