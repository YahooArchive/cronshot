// onCompleteFactory.js
// Returns a callback function to be called when all screen captures have 
//  been completed
// ===============

/* Copyright  2014 Yahoo! Inc.
* Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var utils = require('./utils');

module.exports = exports = function onCompleteFactory(options) {
  if(options.onCompleteCallback && 
    typeof(options.onCompleteCallback) === 'function') {

    return options.onCompleteCallback;
  }

  return utils.noop;
};
