var utils = require('./utils'),
	defaultOptions = require('./defaultOptions'),
	startCronJob = require('./startCronJob'),
	async = require('async'),
	startCapturing = module.exports = exports = function(opts) {
		var parallelTasks = [];

		if(utils.isArray(opts)) {
			opts.forEach(function(currentOptions) {
				parallelTasks.push(startLogic(currentOptions));
			});
			async.parallel(parallelTasks, function(err, results) {
				if(err) {
					utils.logError(err);
				} else {
					console.log('Completed all screen shots!'.green.bold);
				}
			});
		} else {
			startLogic(opts);
		}
	},
	startLogic = function(opts) {
		// merge default options with any command line options and passed options
		var userOptions = utils.mergeOptions((utils.isObject(opts) ? opts : {}), utils.getCommandLineOptions()),
			options = utils.mergeOptions(defaultOptions, userOptions);

    if(!options.saveMiddleware) {
      utils.logError('\n\nNo saveMiddleware option was provided, which means the screenshot would not have been saved =(\n\nPlease add a saveMiddleware option and retry =)');
    } else if(options.siteType === 'url' && !options.url) {
    	utils.logError('\n\nNo website URL was provided, which means a blank page would have been saved =(\n\nPlease add a url option and retry =)')
    } else {
      console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Cronshot will begin according to your cron pattern').magenta);
      startCronJob(options);
    }
	}