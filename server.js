'use strict';
const PORT = 80;
let http = require('http');

let server = http.createServer(),//cоздаем сервер
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    request = require('request');

server.on('request', function (req, res) {//подписались на событие запроса
    let url = req.url,
        method = req.method,
        data = [],
        body;


    if (url === '/') {
        url = '/index.html';
    }
    let filename = path.normalize(process.cwd()+url);
    let mimeType = mime.lookup(url);
/*    req.pipe(request(url)).pipe(res);*/
    console.log(filename);

    fs.stat(filename , function (err, stat) {
        if (!err) {
            fs.readFile(filename , function (err, file) {
                if (err) {
                    res.writeHead(500);
                } else {
                    res.writeHead(200, {
                        "content-type": mimeType
                    });
                    res.write(file);
                }
                res.end();
            });
        } else {
            req.on('data', function (datum) {
                data.push(datum);
            });
            req.on('end', function () {
                body = Buffer.concat(data).toString(); //все данные в data загнали в буффер и преобразовали в текст
                res.writeHead(101);//код ответа сервера
                res.write(JSON.stringify({
                    url,
                    method,
                    body
                }));//ответ сервера
                res.end();//Закрыли запрос
            });
        }
    });
});

server.on('error', function (err) {
    console.log(err);
});

server.listen(PORT, function () {
    console.log(`server is running on http://localhost:${PORT}`);//подписались на событие запуска сервер);//запускаем сервер
});