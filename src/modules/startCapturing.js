// startCapturing.js
// =================

/* Copyright  2014 Yahoo! Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

var utils = require('./utils'),
    defaultOptions = require('./defaultOptions'),
    startCronJob = require('./startCronJob'),
    async = require('async'),
    startLogic = function(opts, callback) {
        // merge default options with any command line options and passed options
        var userOptions = utils.mergeOptions((utils.isObject(opts) ? opts : {}), utils.getCommandLineOptions()),
            options = utils.mergeOptions(defaultOptions, userOptions);

        if (!options.saveMiddleware) {
            utils.logError('\n\nNo saveMiddleware option was provided, which means the screenshot would not have been saved =(\n\nPlease add a saveMiddleware option and retry =)', opts);
            callback(new Error('No saveMiddleware option provided.'));
        } else if (options.siteType === 'url' && !options.url) {
            utils.logError('\n\nNo website URL was provided, which means a blank page would have been saved =(\n\nPlease add a url option and retry =)', opts);
            callback(new Error('No website URL provided.'));
        } else {
            if (options.cronPattern) {
                utils.log(('\n[' + new Date().toUTCString() + '] ').bold + ('Cronshot will begin according to your cron pattern').magenta + ': ' + options.cronPattern.cyan, false, opts);
            } else {
                utils.log(('\n[' + new Date().toUTCString() + '] ').bold + ('Cronshot will begin immediately').magenta, false, opts);
            }
            startCronJob(options, callback);
        }
    };

module.exports = function(opts, onCompleteCallback) {
    onCompleteCallback = utils.isFunction(onCompleteCallback) ? onCompleteCallback : utils.noop;

    var screenshots = opts.screenshots,
        tasks;

    if (utils.isArray(screenshots) && screenshots.length) {
        tasks = screenshots.map(function(opt) {
            return function(cb) {
                startLogic(opt, cb);
            };
        });

        async.parallelLimit(tasks, (opts.parallelLimit || defaultOptions.parallelLimit), function(err) {
            if (err) {
                onCompleteCallback(err);
                return;
            }
            onCompleteCallback(null);
        });
    } else {
        startLogic(opts, onCompleteCallback);
    }
};