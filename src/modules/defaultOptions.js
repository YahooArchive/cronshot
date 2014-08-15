// defaultOptions.js
// =================

/* Copyright  2014 Yahoo! Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

module.exports = {
    'screenSize': {
        'width': 1024,
        'height': 768
    },
    'shotSize': {
        'width': 'window',
        'height': 'window'
    },
    'shotOffset': {
        'left': 0,
        'right': 0,
        'top': 0,
        'bottom': 0
    },
    'phantomPath': 'phantomjs',
    'phantomConfig': {},
    'customHeaders': null,
    'defaultWhiteBackground': true,
    'customCSS': '',
    'quality': 75,
    'streamType': 'png',
    'siteType': 'url',
    'renderDelay': 0,
    'timeout': 0,
    'takeShotOnCallback': false,
    'errorIfStatusIsNot200': false,
    'cronPattern': '*/10 * * * * *',
    'start': true,
    'timeZone': '',
    'url': '',
    'imageName': 'screenshot.png',
    'host': '',
    'hostPath': '',
    'path': '',
    'userAgent': '',
    'saveMiddleware': null,
    'silent': false,
    'max': false,
    'parallelLimit': 5
};