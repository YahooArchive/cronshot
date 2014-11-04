// startCronJob.js
// ===============

/* Copyright  2014 Yahoo! Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

var CronJob = require('cron').CronJob,
    onTickFactory = require('./onTickFactory'),
    utils = require('./utils'),
    count = 0;

module.exports = function(options, callback) {
    if (options.cronPattern) {
        var job = new CronJob(options.cronPattern, function fn() {
            if (utils.isNumber(options.max) && count >= options.max) {
                callback(null, {});
                return;
            }
            count += 1;
            utils.log(('\n[' + new Date().toUTCString() + '] ').bold + ('Starting to capture: ').rainbow + (options.url).underline, false, options);
            // don't call callback for each tick of the CronJob
            onTickFactory(options, utils.noop);
            return fn;
        }, callback, options.start, options.timeZone);

        job.start();
    } else {
        onTickFactory(options, callback);
    }
};