var CronJob = require('cron').CronJob,
	onTickFactory = require('./onTickFactory'),
	utils = require('./utils'),
	/*  onCompleteFactory: return onComplete function for cronjob given 
	 *    cronshot options 
	 *  ENSURES: returns a function that handles onComplete events 
	 */
	onCompleteFactory = utils.noop,
	startCronJob = module.exports = exports = function(options) {
		if(options.cronPattern) {
			var job = new CronJob(options.cronPattern, function fn() {
				console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Starting to capture: ').rainbow + (options.url).underline);
				onTickFactory(options);
				return fn;
			}, onCompleteFactory, options.start, options.timeZone);

			job.start();
		} else {
			onTickFactory(options);
		}
	};