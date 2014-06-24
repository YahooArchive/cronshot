// colors.js
// =========

/* Copyright  2014 Yahoo! Inc.
* Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var colors = require('colors'),
  utils = module.exports = {
    'isObject': function(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },
    'isArray': function(arr) {
      if('isArray' in Array) {
        return Array.isArray(arr);
      } 
      else {
        return Object.prototype.toString.call(arr) === '[object Array]';
      }
    },
    'each': function(collection, callback) {
      var x,
        len;

      if(utils.isArray(collection)) {
        x = -1;
        len = collection.length;
        while(++x < len) {
          if (callback(x, collection[x]) === false) {
            break;
          }
        }
      } 
      else if(utils.isObject(collection)) {
        for(x in collection) {
          if(collection.hasOwnProperty(x)) {
            if (callback(x, collection[x]) === false) {
              break;
            }
          }
        }
      }
      else {
        throw new Error('Unsupported Collection');
      }
    },
    'mergeOptions': function deepMerge(defaultOptions, userOptions) {
      if(!utils.isObject(defaultOptions) || !utils.isObject(userOptions)) {
        return;
      }
      var newObj = {};

      utils.each(defaultOptions, function(key, val) {
        newObj[key] = defaultOptions[key];
      });

      utils.each(userOptions, function(key, val) {
        var currentUserOption = userOptions[key];
        if(!utils.isObject(currentUserOption)) {
          newObj[key] = currentUserOption;
        } 
        else {
          if(!defaultOptions[key]) {
            newObj[key] = currentUserOption;
          } 
          else {
            newObj[key] = deepMerge(defaultOptions[key], currentUserOption);
          }
        }
      });

      return newObj;
    },
    'getCommandLineOptions': function() {
      var argsObj = {};

      process.argv.forEach(function(arg, iterator) {
        if(arg.charAt(0) === '-' && arg.charAt(1) === '-') {
          argsObj[arg.substring(2, arg.length)] = process.argv[iterator + 1];
        }
      });

      return argsObj;
    },
    'noop': function noop() {},
    'makeLog': function(info, color) {
      color = color || 'green';
      return console.log(('\n['+ new Date().toUTCString() + '] ').bold + info[color] + '\n');
    },
    'logError': function(msg, color) {
      color = color || 'red';
      return utils.makeLog(msg, color);
    },
    'log': function(msg, color) {
      return utils.makeLog(msg, color);
    }
  };