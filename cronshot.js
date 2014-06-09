var CronJob = require('cron').CronJob;
var webshot = require('./libs/webshot/lib/webshot');
var fs = require('fs');
var mobstor = require('mobstor');
var utils = require('./utils');
var defaultOptions = require('./config/default_options');

function saveToMobstor(options) {
  var content = fs.createReadStream(options.imageName);
  var config = {
    host : options.mobstorHost
  };
  var client = mobstor.createClient(config);

  client.storeFile(options.mobstorPath, content, function (err) {
    // skip 409 conflict issues since the asset was uploaded correctly
    if (err && err.code !== 409) {
      utils.logError(err);
    } 
    else {
      utils.log('Successfully deployed ' + options.imageName);
    }
  });
}

/*  onTickFactory: return onTick function for cronjob given cronshot options 
 *  ENSURES: returns a function that handles onTick events 
 */
var onTickFactory = function(options) {
  return function() {
    webshot(options.url, options.imageName, options, function(err) {
      if(err)
        return utils.logError(err);
      saveToMobstor(options);
    });
  };
};

/*  onCompleteFactory: return onComplete function for cronjob given 
 *    cronshot options 
 *  ENSURES: returns a function that handles onComplete events 
 */
var onCompleteFactory = function(options) {
  return utils.noop;
};

var startCronJob = function(opt) {
  var job = new CronJob({
    'cronTime': opt.cronPattern,
    'onTick': onTickFactory(opt),
    'onComplete': onCompleteFactory(opt),
    'start': opt.start,
    'timeZone': opt.timeZone
  });
};

var startCapturing = function(opts) {
  // merge default options with any command line options and passed options
  var options = utils.mergeOptions(defaultOptions, 
    utils.mergeOptions(
      (utils.isObject(opts) ? opts : {}), 
      utils.getCommandLineOptions()
    )
  );

  utils.log('Starting to capture ' + options.url);
  startCronJob(options);
};

var cronshot = module.exports = {
  'startCapturing': startCapturing
};
