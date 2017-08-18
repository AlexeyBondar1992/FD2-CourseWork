(function () {
    'use strict';
    class BeginPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.content = new Begin('begin','content');
        }
        load(){
            return super.load().then(function () {
                let content = window.document.getElementById('content');
                content.style.perspective = '700px';
            });
        }
    }
    window.BeginPage = BeginPage;
}());