(function () {
    'use strict';
    class SettingsPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.menu = new SettingsMenu('settingsMenu','navigation');
            this.content = new Settings('settings','content');
            this.footer = new Footer('footer','footer');
        }
        load(){
            return super.load().then(function () {
                let settingsBtn = window.document.querySelector('#footer').querySelector('a[href="#settings"]'),
                    body = window.document.querySelector('body'),
                    content = window.document.getElementById('content');
                content.style.perspective = 'none';
                if(settingsBtn) {
                    settingsBtn.parentNode.classList.add('turnedButton');
                }
                settingsBtn.addEventListener('click', function back(e) {
                    settingsBtn.removeEventListener('click', back);
                    settingsBtn.parentNode.classList.remove('turnedButton');
                    history.back();
                })


            });
        }
    }
    window.SettingsPage = SettingsPage;
}());