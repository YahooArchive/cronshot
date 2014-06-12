/*  onTickFactory: return onTick function for cronjob given cronshot options 
 *  ENSURES: returns a function that handles onTick events 
 */
var webshot = require('../../forked_libs/webshot/lib/webshot'),
  fs = require('fs'),
  utils = require('./utils'),
  fileCleanUp = function(options, removeFile) {
    var host = options.host,
      path = options.path,
      imageName = options.imageName;

    if(removeFile !== false) {
      try {
        fs.unlinkSync(options.imageName);
      } catch(err) {};
    }

    console.log(('Successfully deployed to: ').green + (host + path + imageName).bold);
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
      middleware({
        'options': options,
        'readStream': readStream
      }, function(err, removeFile) {
        if(!err) {
          fileCleanUp(options, removeFile);
        } else if(err) {
          throw new Error(utils.logError(err));
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

    if(saveMiddlewareOption && typeof saveMiddlewareOption === 'function') {
      saveMiddleware({
        'middleware': saveMiddlewareOption,
        'lastMiddleware': true,
        'options': options,
        'readStream': readStream
      });
    } else {
      fileCleanUp(options);
    }
  });
};