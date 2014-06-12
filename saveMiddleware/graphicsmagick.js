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
      'name': 'graphicksmagick'
    };

  try {
    imageMagick(content, fullPath)
      .implode(-1.2)
      .write(fullPath, function(err) {
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