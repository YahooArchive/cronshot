/*  onTickFactory: return onTick function for cronjob given cronshot options 
 *  ENSURES: returns a function that handles onTick events 
 */
var webshot = require('../../forked_libs/webshot/lib/webshot'),
  fs = require('fs'),
  utils = require('./utils'),
  fileCleanUp = function(options, info) {
    var host = options.host,
      path = options.path,
      imageName = options.imageName,
      middlewareName = info.name || 'Unknown',
      removeFile = info.removeFile || false;

    if(removeFile !== false) {
      try {
        fs.unlinkSync(options.imageName);
      } catch(err) {};
    }

    console.log(('Successfully used the ' + middlewareName + ' middleware: ').green + (host + path + imageName).bold);
  },
  saveMiddleware = function(obj) {
    var middleware = obj.middleware,
      lastMiddleware = obj.lastMiddleware,
      readStream = obj.readStream,
      options = obj.options,
      host = options.host,
      path = options.path,
      imageName = options.imageName;

    if(!path) {
      throw new Error(utils.logError('No path option was provided. Please add a path option and run again =)'));
    } else if(!imageName) {
      throw new Error(utils.logError('No imageName option was provided.  Please add an imageName option and run again =)'));
    } else {
      if(path && imageName) {
        options.imageName = path.charAt(path.length - 1) === '/' ? imageName: '/' + imageName;
      }

      middleware({
        'options': options,
        'readStream': readStream
      }, function(err, info) {
        if(err) {
          throw new Error(err);
        } else {
          fileCleanUp(options, info);
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
        });
      } else if(utils.isObject(saveMiddleware) && saveMiddleware.middleware) {
        saveMiddleware({
          'middleware': middleware,
          'lastMiddleware': true,
          'options': utils.isObject(saveMiddleware.options) ? utils.mergeOptions(options, saveMiddleware.options) : options,
          'readStream': readStream
        });
      } else if(utils.isArray(saveMiddlewareOption)) {
        utils.each(saveMiddlewareOption, function(iterator, currentMiddleware) {
          if(utils.isObject(currentMiddleware) && typeof currentMiddleware.middleware === 'function') {
            saveMiddleware({
              'middleware': currentMiddleware.middleware,
              'lastMiddleware': (iterator === saveMiddlewareOption.length ? true : false),
              'options': currentMiddleware.options && utils.isObject(currentMiddleware.options) ? utils.mergeOptions(options, currentMiddleware.options) : options,
              'readStream': readStream
            });
          } else if(typeof currentMiddleware === 'function') {
            saveMiddleware({
              'middleware': currentMiddleware,
              'lastMiddleware': (iterator === saveMiddlewareOption.length ? true : false),
              'options': options,
              'readStream': readStream
            });
          }
        });
      }
    } else {
      fileCleanUp(options);
    }
  });
};