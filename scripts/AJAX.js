(function() {
    let cors_api_host = 'cors-anywhere.herokuapp.com';
    let cors_api_url = 'https://' + cors_api_host + '/';
    let slice = [].slice;
    let origin = window.location.protocol + '//' + window.location.host;
    let open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        let args = slice.call(arguments);
        let targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

(function () {
    'use strict';
    function makeRequest(method, url, type) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = type;
            xhr.open(method, url, true);
            xhr.addEventListener('error', reject);
            xhr.addEventListener('load', function () {
                resolve(xhr.response);
            });
            xhr.send();
        });
    }
    window.makeRequest = makeRequest;
}());

