(function () {
    'use strict';
    class BeginPage extends PageGenerator {
        constructor(location) {
            super(location);
            this.content = new Begin('begin','content');
        }
    }
    window.BeginPage = BeginPage;
}());