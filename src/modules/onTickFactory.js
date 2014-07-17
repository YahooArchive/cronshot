// onTickFactory.js
// ================

/* Copyright  2014 Yahoo! Inc.
* Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var webshot = require('webshot'),
  async = require('async'),
  fs = require('fs'),
  utils = require('./utils'),
  saveMiddleware = function(obj, callback) {
    callback = callback || function() {};
    var middleware = obj.middleware,
      readStream = obj.readStream,
      options = obj.options,
      host = options.host,
      hostPath = options.hostPath,
      path = options.path,
      imageName = options.imageName;

    if(!path) {
      utils.logError('No path option was provided. Please add a path option and run again =)');
      callback(new Error('No path option was provided. Please add a path option and run again =)'));
    } else if(!imageName) {
      utils.logError('No imageName option was provided.  Please add an imageName option and run again =)');
      callback(new Error('No imageName option was provided.  Please add an imageName option and run again =)'));
    } else {
      if(path && imageName) {
        options.imageName = imageName = path.charAt(path.length - 1) === '/' || imageName.charAt(0) === '/' ? imageName: '/' + imageName;
      }

      middleware({
        'options': options,
        'readStream': readStream
      }, function(err, info) {
        if(err) {
          utils.logError(err);
          callback(err);
        } else {
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used the ' + info.name + ' middleware: ').green + (host + (hostPath || path) + imageName).underline);
          callback(null);
        }
      });
    }
  };

module.exports = exports = function onTickFactory(options, onCompleteCallback) {
  var saveMiddlewareOption = options.saveMiddleware;

  webshot(options.url, options, function(err, readStream) {
    if(err) {
  	 utils.logError(err);
     onCompleteCallback(err);
     return;
    }

    if(saveMiddlewareOption) {
      if(typeof saveMiddlewareOption === 'function') {
        saveMiddleware({
          'middleware': saveMiddlewareOption,
          'lastMiddleware': true,
          'options': options,
          'readStream': readStream
        }, function(err) {
          if(err) {
            onCompleteCallback(err);
            return;
          }
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold);      
          onCompleteCallback(null);
        });
      } else if(utils.isObject(saveMiddleware) && saveMiddleware.middleware) {
        saveMiddleware({
          'middleware': middleware,
          'lastMiddleware': true,
          'options': utils.isObject(saveMiddleware.options) ? utils.mergeOptions(options, saveMiddleware.options) : options,
          'readStream': readStream
        }, function(err) {
          if(err) {
            onCompleteCallback(err);
            return;
          }
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold);      
          onCompleteCallback(null);
        });
      } else if(utils.isArray(saveMiddlewareOption) && saveMiddlewareOption.length) {
        var funs = saveMiddlewareOption.map(function(currentMiddleware) {
          return function(cb) {
            if(utils.isObject(currentMiddleware) && typeof currentMiddleware.middleware === 'function') {
              saveMiddleware({
                'middleware': currentMiddleware.middleware,
                'options': currentMiddleware.options && utils.isObject(currentMiddleware.options) ? utils.mergeOptions(options, currentMiddleware.options) : options,
                'readStream': readStream
              }, cb);
            } else if(typeof currentMiddleware === 'function') {
              saveMiddleware({
                'middleware': currentMiddleware,
                'options': options,
                'readStream': readStream
              }, cb);
            }
          };
        });

        async.series(funs, function(err) {
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold);      
          onCompleteCallback(err);
        });
      }
    }
  });
};
