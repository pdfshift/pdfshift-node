PDFShift Node Package
=======================

This Node package provides a simplified way to interact with the [PDFShift](https://pdfshift.io) API.

## Documentation

See the full documentation on [PDFShift's documentation](https://pdfshift.io/documentation).

## Installation

You should not require this code directly. Instead, just run:

    npm install --save pdfshift

### Requirements

* [Request](https://www.npmjs.com/package/request)

## Usage

This library needs to be configured with your `api_key` received when creating an account.
Setting it is easy as:

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
```

### Basic example

#### With an URL

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

pdfshift.convert('https://www.example.com').then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {})
```

#### With inline HTML data:

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

let data = fs.readFileSync('invoice.html', 'utf8');

pdfshift.convert(data).then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {})
```

### Custom CSS

#### Loading CSS from an URL:

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

pdfshift.convert('https://www.example.com', {css: 'https://www.example.com/public/css/print.css'}).then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {})
```

#### Loading CSS from a string:

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

pdfshift.convert('https://www.example.com', {css: 'a {text-decoration: underline; color: blue}'}).then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {})
```

### Custom HTTP Headers

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://httpbin.org/headers')
    .setHTTPHeaders({
        'X-Original-Header': 'Awesome value'
    })
    .addHTTPHeader('user-agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0') // Also works like this
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

### Accessing secured pages

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://httpbin.org/basic-auth/user/passwd')
    .auth('user', 'passwd')
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

### Using cookies

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://httpbin.org/cookies')
    .addCookie({name: 'session', value: '4cb496a8-a3eb-4a7e-a704-f993cb6a4dac'})
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

### Adding Watermark (Oh hi Mark!)

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://www.example.com')
    .watermark({
        image: 'https://pdfshift.io/static/img/logo.png',
        offset_x: 50,
        offset_y: '100px',
        rotate: 45
    })
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

### Custom Header (or Footer)

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://www.example.com')
    .footer({source: '<div>Page {{page}} of {{total}}</div>', spacing: '50px'})
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

### Protecting the generated PDF

```javascript
const pdfshift = require('pdfshift')('120d8e8a86d2....................');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://www.example.com')
    .protect({
        user_password: 'user',
        owner_password: 'owner',
        no_print: true
    })
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```
