const pdfshift = require('./')('120d8e8a86d2....................');

const fs = require('fs');

pdfshift.prepare('https://pdfshift.io/documentation')
    .convert()
    .then(function (binary_file) {
        fs.writeFile('documentation.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {
        console.error(message)
    })
