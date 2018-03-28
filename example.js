const pdfshift = require('./')('7d981dad10904d5297b970132de7177d');
const fs = require('fs');

// pdfshift.convert('https://www.example.com')
pdfshift.prepare('https://www.example.com', {'landscape': false}).margin({left: '20px'}).addHTTPHeader('X-Header-Test', 'Trol').convert().then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {
    console.error('OH NO')
    console.error(message, code, errors)
})
