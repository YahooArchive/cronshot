/*  onTickFactory: return onTick function for cronjob given cronshot options 
 *  ENSURES: returns a function that handles onTick events 
 */
var webshot = require('webshot'),
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
    } else if(!imageName) {
      utils.logError('No imageName option was provided.  Please add an imageName option and run again =)');
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
        } else {
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used the ' + info.name + ' middleware: ').green + (host + (hostPath || path) + imageName).underline);
          callback();
        }
      });
    }
  };

module.exports = exports = function onTickFactory(options) {
  var saveMiddlewareOption = options.saveMiddleware;

  webshot(options.url, options, function(err, readStream) {
    if(err) {
  	 return utils.logError(err);
    }

    if(saveMiddlewareOption) {
      if(typeof saveMiddlewareOption === 'function') {
        saveMiddleware({
          'middleware': saveMiddlewareOption,
          'lastMiddleware': true,
          'options': options,
          'readStream': readStream
        }, function() {
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold);      
        });
      } else if(utils.isObject(saveMiddleware) && saveMiddleware.middleware) {
        saveMiddleware({
          'middleware': middleware,
          'lastMiddleware': true,
          'options': utils.isObject(saveMiddleware.options) ? utils.mergeOptions(options, saveMiddleware.options) : options,
          'readStream': readStream
        }, function() {
          console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold);      
        });
      } else if(utils.isArray(saveMiddlewareOption) && saveMiddlewareOption.length) {
        (function loop(iterator) {
          iterator = iterator || 0;
          var currentMiddleware = saveMiddlewareOption[iterator];
          if(!currentMiddleware) {
            console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold);      
            return;
          }
          if(utils.isObject(currentMiddleware) && typeof currentMiddleware.middleware === 'function') {
            saveMiddleware({
              'middleware': currentMiddleware.middleware,
              'options': currentMiddleware.options && utils.isObject(currentMiddleware.options) ? utils.mergeOptions(options, currentMiddleware.options) : options,
              'readStream': readStream
            }, function() {
              loop(++iterator);
            });
          } else if(typeof currentMiddleware === 'function') {
            saveMiddleware({
              'middleware': currentMiddleware,
              'options': options,
              'readStream': readStream
            }, function() {
              loop(++iterator);
            });
          }

        }());
      }
    }
  });
};