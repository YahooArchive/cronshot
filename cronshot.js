var CronJob = require('cron').CronJob;
var webshot = require('webshot');
var fs = require('fs');
var mobstor = require('mobstor');
var utils = require('./utils');
var defaultOptions = require('./config/default_options');
var _ = require('underscore');

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

var onTick = function(options) {
  webshot(options.url, options.imageName, options, function(err) {
    if(err)
      return utils.logError(err);
    saveToMobstor(options);
  });
};

var onComplete = function(options) {
  // do nothing
};

var startCronJob = function(opt) {
  var job = new CronJob({
    'cronTime': opt.cronPattern,
    'onTick': _.partial(onTick, opt),
    'onComplete': _.partial(onComplete, opt),
    'start': opt.start,
    'timeZone': opt.timeZone
  });
};

var startCapturing = function(opts) {
  // merge default options with any command line options and passed options
  var options = _.defaults(
    utils.getCommandLineOptions(), 
    _.defaults((utils.isObject(opts) ? opts : {}), defaultOptions)
  );

  utils.log('Starting to capture ' + options.url);
  startCronJob(options);
};

var cronshot = module.exports = {
  'startCapturing': startCapturing
};
