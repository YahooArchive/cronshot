var gm = require('gm'),
  imageMagick = gm.subClass({ imageMagick: true }),
  fs = require('fs');

module.exports = exports = function saveToLocal(obj, callback) {
  var options = obj.options,
    content = obj.readStream,
    path = options.path,
    imageName = options.imageName,
    fullPath = path + imageName,
    host = options.host,
    removeFile = false,
    info = {
      'name': 'imagemagick'
    },
    gmCommands = options.gmCommands,
    imageMagickContent = {};

  try {
    imageMagickContent = imageMagick(content);
    if(Array.isArray(gmCommands) && gmCommands.length) {
      gmCommands.forEach(function(currentCommand) {
        currentCommand = currentCommand || {};
        var method = currentCommand.method,
          args = currentCommand.args || [];

        if(method) {
          if(args.length > 1) {
            imageMagickContent[method].apply(imageMagickContent, args.join(','));
          } else {
            imageMagickContent[method].call(imageMagickContent, args.join(','));
          }
        }
      });
    }
    imageMagickContent.write(fullPath, function(err) {
      if(err) {
        callback(err, info);
      } else {
        callback(null, info);
      }
    });
  } catch(e) {
    callback(e, info);
  }
};