var utils = require('./utils'),
	defaultOptions = require('./defaultOptions'),
	startCronJob = require('./startCronJob'),
	startCapturing = module.exports = exports = function(opts) {
		// merge default options with any command line options and passed options
		var userOptions = utils.mergeOptions((utils.isObject(opts) ? opts : {}), utils.getCommandLineOptions()),
			options = utils.mergeOptions(defaultOptions, userOptions);

		utils.log('Starting to capture ' + options.url);
		startCronJob(options);
	};