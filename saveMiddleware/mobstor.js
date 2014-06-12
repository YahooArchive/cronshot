var mobstor = require('mobstor'),
  fs = require('fs'),
  colors = require('colors');

module.exports = exports = function saveToMobstor(obj, callback) {
  var options = obj.options,
    host = options.host,
    path = options.path,
    imageName = options.imageName,
    fullPath = path + imageName,
    content = fs.createReadStream(fullPath),
    hostPath = options.hostPath,
    config = {
      'host' : host
    },
    client,
    info = {
      'name': 'mobstor'
    };

    if(!host) {
      throw new Error('No host option was provided.  Please add a host option and run again =)'.red);
    }

    client = mobstor.createClient(config);

    client.storeFile(hostPath + imageName, content, function (err) {
      // skip 409 conflict issues since the asset was uploaded correctly
      if (err && err.code !== 409) {
        // utils.logError(err);
        callback(err, info);
      } 
      else {
        callback(null, info);
      }
    });
};