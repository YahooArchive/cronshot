// startCronJob.js
// ===============

/* Copyright  2014 Yahoo! Inc.
* Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var CronJob = require('cron').CronJob,
	onTickFactory = require('./onTickFactory'),
	onCompleteFactory = require('./onCompleteFactory'),
  utils = require('./utils'),
	startCronJob = module.exports = exports = function(options) {
    var onCompleteCallback = onCompleteFactory(options);

		if(options.cronPattern) {
			var job = new CronJob(options.cronPattern, function fn() {
				console.log(('\n['+ new Date().toUTCString() + '] ').bold + ('Starting to capture: ').rainbow + (options.url).underline);
        // don't call onCompleteCallback for each tick of the CronJob
				onTickFactory(options, utils.noop);
				return fn;
			}, onCompleteCallback, options.start, options.timeZone);

			job.start();
		} else {
			onTickFactory(options, onCompleteCallback); 
		}
	};
