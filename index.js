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

// PDFShift.apiBaseUrl = 'https://pdfshift.io/v2'
PDFShift.apiBaseUrl = 'http://127.0.0.1:5000/v2'

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
        this.options['auth'] = arguments
        return this
    },
    setCookies: function (cookies) {
        this.options['cookies'] = cookies
        return this
    },
    addCookie: function (name, value, secure = false, http_only = false) {
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
    header: function (source, spacing = null) {
        if (source === null) {
            delete this.options['header'];
        } else {
            this.options['header'] = arguments
        }
        return this
    },
    footer: function (source, spacing = null) {
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
    watermark: function (source, offset_x = null, offset_y = null, rotation = null, background = false) {
        this.options['watermark'] = arguments
        return this
    },
    convert: function () {
        return this._parent.convert(this.options)
    }
}

PDFShift.prototype = {
    setApiKey(key) {
        if (key) {
            this.apiKey = key
        }
    },
    convert: function(options) {
        return new Promise((resolve, reject) => {
            request.post(PDFShift.apiBaseUrl + '/convert/', {'auth': {'user': this.apiKey}, 'json': options}, (error, response, body) => {
                body = this._parseResponse(response, body, reject)
                if (body === undefined) return
                return resolve(Buffer.from(body.content, 'base64'))
            })
        })
    },
    prepare: function(source, options) {
        return new PDFShiftPrepared(source, options, this)
    },
    credits: function() {
        return new Promise((resolve, reject) => {
            request.get(PDFShift.apiBaseUrl + '/credits/', {'auth': {'user': this.apiKey}}, (error, response, body) => {
                body = this._parseResponse(response, body, reject)
                if (body === undefined) return
                return resolve(body)
            })
        })
    },
    _parseResponse: function(response, body, reject) {
        if (typeof(body) === 'string') {
            try {
                body = JSON.parse(body)
            } catch (e) {
                let statusCode = 0
                if (response !== undefined) {
                    statusCode = response.statusCode
                }
                return reject({'message': 'Invalid response from the server.', 'code': statusCode, 'response': response})
            }
        }

        if (response.statusCode >= 400) {
            // Handle errors
            if ('errors' in body) {
                return reject({'message': 'Invalid data submitted', 'code': body.code, 'response': response, 'errors': body.errors})
            }

            return reject({'message': body.error, 'code': body.code, 'response': response})
        }

        return body
    }
}

module.exports = PDFShift;
