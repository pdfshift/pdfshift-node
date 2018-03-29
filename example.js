const pdfshift = require('./')('120d8e8a86d24c6daa604a9c14fd7c7f');
const fs = require('fs');

/*
pdfshift.prepare('https://www.example.com', {'landscape': false}).margin({left: '20px'}).addHTTPHeader('X-Header-Test', 'Trol').convert().then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {
    console.error('OH NO')
    console.error(message, code, errors)
})
*/

pdfshift.prepare('https://httpbin.org/headers')
    .setHTTPHeaders({
        'X-Original-Header': 'Awesome value',
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    })
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
