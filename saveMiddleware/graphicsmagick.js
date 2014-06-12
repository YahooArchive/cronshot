var gm = require('gm'),
  imageMagick = gm.subClass({ imageMagick: true }),
  fs = require('fs');

module.exports = exports = function saveToLocal(obj, callback) {
  var options = obj.options,
    content = obj.readStream,
    path = options.path,
    imageName = options.imageName,
    host = options.host,
    removeFile = false,
    info = {
      'name': 'graphicksmagick'
    },
    fullPath = path + imageName;

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