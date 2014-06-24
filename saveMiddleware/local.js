// local.js
// ========

/* Copyright  2014 Yahoo! Inc.
* Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var fs = require('fs');

module.exports = exports = function saveToLocal(obj, callback) {
  var options = obj.options,
    content = obj.readStream,
    path = options.path,
    imageName = options.imageName,
    fullPath = path + imageName,
    writeStream = fs.createWriteStream(fullPath),
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