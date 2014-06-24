// startCronJob.js
// ===============

/* Copyright  2014 Yahoo! Inc.
* Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var CronJob = require('cron').CronJob,
	onTickFactory = require('./onTickFactory'),
	utils = require('./utils'),
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