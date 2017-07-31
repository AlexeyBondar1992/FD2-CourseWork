(function () {
    'use strict';
    let url = window.location.href.split('/index.html');
    url.pop();
    const URL_BEGIN = url.join('/');
    window.URL_BEGIN = URL_BEGIN;
}());
