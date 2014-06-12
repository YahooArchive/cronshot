var fs = require('fs');

module.exports = exports = function saveToLocal(obj, callback) {
  var options = obj.options,
    content = obj.readStream,
    path = options.path,
    imageName = options.imageName,
    writeStream = fs.createWriteStream(path + imageName),
    info = {
      'name': 'local'
    };

  content.on('end', function() {
    writeStream.end();
    callback(null, info);
  });

  try {
    content.pipe(writeStream);
  } catch(e) {
    callback(e, info);
  }
};