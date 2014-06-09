var mobstor = require('mobstor'),
  fs = require('fs'),
  utils = require('./utils');

module.exports = exports = function saveToMobstor(options) {
  var content = fs.createReadStream(options.imageName),
    config = {
      'host' : options.mobstorHost
    },
    client = mobstor.createClient(config);

  client.storeFile(options.mobstorPath, content, function (err) {
    // skip 409 conflict issues since the asset was uploaded correctly
    if (err && err.code !== 409) {
      utils.logError(err);
    } 
    else {
		  utils.log('Successfully deployed ' + options.imageName, 'rainbow');
      if(!options.saveImageLocally) {
      	try {
      		fs.unlinkSync(options.imageName);
      	} catch(err) {}
      }
    }
  });
}