"use strict";

// __/\\\\\\\\\\\\\____/\\\\\\\\\\\\_____/\\\\\\\\\\\\\\\___/\\\\\\\\\\\____/\\\______________________/\\\\\______________________
// __\/\\\/////////\\\_\/\\\////////\\\__\/\\\///////////__/\\\/////////\\\_\/\\\____________________/\\\///______________________
// ___\/\\\_______\/\\\_\/\\\______\//\\\_\/\\\____________\//\\\______\///__\/\\\__________/\\\_____/\\\_________/\\\____________
// ____\/\\\\\\\\\\\\\/__\/\\\_______\/\\\_\/\\\\\\\\\\\_____\////\\\_________\/\\\_________\///___/\\\\\\\\\___/\\\\\\\\\\\______
// _____\/\\\/////////____\/\\\_______\/\\\_\/\\\///////_________\////\\\______\/\\\\\\\\\\___/\\\_\////\\\//___\////\\\////______
// ______\/\\\_____________\/\\\_______\/\\\_\/\\\___________________\////\\\___\/\\\/////\\\_\/\\\____\/\\\________\/\\\_________
// _______\/\\\_____________\/\\\_______/\\\__\/\\\____________/\\\______\//\\\__\/\\\___\/\\\_\/\\\____\/\\\________\/\\\_/\\____
// ________\/\\\_____________\/\\\\\\\\\\\\/___\/\\\___________\///\\\\\\\\\\\/___\/\\\___\/\\\_\/\\\____\/\\\________\//\\\\\____
// _________\///______________\////////////_____\///______________\///////////_____\///____\///__\///_____\///__________\/////____



// *****************************************************************************
// ******************************* DISCLAIMER **********************************
// *****************************************************************************
//                                                                             *
// I'm not a Node developer, only knows a bit of JS, but a beginner to ES6     *
//                                                                             *
// If you find errors, or bad implementations                                  *
// Feel free to open an issue at:                                              *
// https://github.com/pdfshift/pdfshift-node/issues/new                        *
//                                                                             *
// Or even better, a Pull Request, to improve this package :)                  *
//                                                                             *
// Thanks !!                                                                   *
// *****************************************************************************

PDFShift.apiBaseUrl = 'https://api.pdfshift.io/v2'

const request = require('request')

function PDFShift(key) {
    if (!(this instanceof PDFShift)) {
        return new PDFShift(key)
    }

    this.setApiKey(key)
}

let PDFShiftPrepared = function(source, options = {}, _parent) {
    this.options = options
    this.options['source'] = source
    this._parent = _parent
}

PDFShiftPrepared.prototype = {
    margin: function ({top = null, right = null, bottom = null, left = null}) {
        this.options['margin'] = arguments[0]
        return this
    },
    auth: function (username = null, password = null) {
        this.options['auth'] = {
            username: username,
            password: password
        }
        return this
    },
    setCookies: function (cookies) {
        this.options['cookies'] = cookies
        return this
    },
    addCookie: function ({name, value, secure = false, http_only = false}) {
        if (!('cookies' in this.options)) {
            this.options['cookies'] = []
        }

        this.options['cookies'].push(arguments)
        return this
    },
    clearCookies: function () {
        if ('cookies' in this.options) {
            delete this.options['cookies']
        }
        return this
    },
    setHTTPHeaders: function (headers) {
        this.options['http_headers'] = headers
        return this
    },
    addHTTPHeader: function (name, value = null) {
        if (!('http_headers' in this.options)) {
            this.options['http_headers'] = {}
        }

        this.options['http_headers'][name] = value
        return this
    },
    clearHTTPHeaders: function () {
        if ('http_headers' in this.options) {
            delete this.options['http_headers']
        }
        return this
    },
    header: function ({source, spacing = null}) {
        if (source === null) {
            delete this.options['header'];
        } else {
            this.options['header'] = arguments
        }
        return this
    },
    footer: function ({source, spacing = null}) {
        if (source === null) {
            delete this.options['footer'];
        } else {
            this.options['footer'] = arguments
        }
        return this
    },
    protect: function ({encryption = 128, author = null, userPassword : user_password = null, ownerPassword : owner_password = null, noPrint : no_print = false, noCopy : no_copy = false, noModify : no_modify = false}) {
        this.options['protection'] = arguments[0]
        return this
    },
    watermark: function ({text = null, image = null, source = null, offset_x = null, offset_y = null, rotate = null, font_size = 16, font_family = null, font_color = null, font_opacity = 100, font_bold = false, font_italic = false}) {
        let watermark = arguments[0];
        let present = 0;
        if (watermark['text'] === null) {
            delete watermark['text']
        } else {
            present++;
        }
        if (watermark['image'] === null) {
            delete watermark['image']
        } else {
            present++;
        }
        if (watermark['source'] === null) {
            delete watermark['source']
        } else {
            present++;
        }

        if (present !== 1) {
            throw 'Please indicate either "source", "image" or "text" for watermark.'
        }

        this.options['watermark'] = watermark
        return this
    },
    convert: function () {
        return this._parent.convert(this.options['source'], this.options)
    }
}

PDFShift.prototype = {
    setApiKey(key) {
        if (key) {
            this.apiKey = key
        }
    },
    convert: function(source, options = null) {
        if (options === null) {
            options = {}
        }

        options['source'] = source
        return new Promise((resolve, reject) => {
            request.post(PDFShift.apiBaseUrl + '/convert/', {'auth': {'user': this.apiKey}, 'json': options, 'encoding': null, ecdhCurve: 'auto'}, (error, response, body) => {
                this._checkResponse(response, body, reject)
                if (body === undefined) return
                return resolve(body)
            })
        })
    },
    prepare: function(source, options) {
        return new PDFShiftPrepared(source, options, this)
    },
    credits: function() {
        return new Promise((resolve, reject) => {
            request.get(PDFShift.apiBaseUrl + '/credits/', {'auth': {'user': this.apiKey}, ecdhCurve: 'auto'}, (error, response, body) => {
                this._checkResponse(response, body, reject)
                if (body === undefined) return
                return resolve(JSON.parse(body))
            })
        })
    },
    _checkResponse: function(response, body, reject) {
        if (response === undefined) {
            return reject({'message': 'Invalid response from the server.', 'code': 0, 'response': response})
        }

        if (response.statusCode == 200) {
            return true
        }

        if (response.statusCode >= 400) {
            // Handle errors
            if ('errors' in body) {
                return reject({'message': 'Invalid data submitted', 'code': body.code, 'response': response, 'errors': body.errors})
            }

            return reject({'message': body.error, 'code': body.code, 'response': response})
        }

        return reject({'message': 'Invalid response from the server.', 'code': 0, 'response': response})
    }
}

module.exports = PDFShift;
