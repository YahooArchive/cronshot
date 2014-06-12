var mobstor = require('mobstor'),
  fs = require('fs');

module.exports = exports = function saveToMobstor(obj, callback) {
  var options = obj.options,
    content = obj.readStream,
    host = options.host,
    path = options.path,
    imageName = options.imageName,
    config = {
      'host' : host
    },
    client;

    if(!host) {
      throw new Error(console.log('No host option was provided.  Please add a host option and run again =)'));
    }

    client = mobstor.createClient(config);

    client.storeFile(path + imageName, content, function (err) {
      // skip 409 conflict issues since the asset was uploaded correctly
      if (err && err.code !== 409) {
        // utils.logError(err);
        callback(err);
      } 
      else {
        callback(null);
      }
    });
};