// onTickFactory.js
// ================

/* Copyright  2014 Yahoo! Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

var webshot = require('webshot'),
    async = require('async'),
    utils = require('./utils'),
    saveMiddleware = function(obj, callback) {
        callback = callback || function() {};
        var middleware = obj.middleware,
            readStream = obj.readStream,
            options = obj.options,
            host = options.host,
            hostPath = options.hostPath,
            path = options.path,
            imageName = options.imageName;

        if (!path) {
            utils.logError('No path option was provided. Please add a path option and run again =)', options);
            callback(new Error('No path option was provided. Please add a path option and run again =)'));
        } else if (!imageName) {
            utils.logError('No imageName option was provided.  Please add an imageName option and run again =)', options);
            callback(new Error('No imageName option was provided.  Please add an imageName option and run again =)'));
        } else {
            if (path && imageName) {
                options.imageName = imageName = path.charAt(path.length - 1) === '/' || imageName.charAt(0) === '/' ? imageName : '/' + imageName;
            }

            middleware({
                'options': options,
                'readStream': readStream
            }, function(err, info) {
                var consoleName = info && info.name ? info.name.indexOf('local') !== -1 ? path + imageName : host + hostPath + imageName : 'Unknown';

                if (err) {
                    utils.logError(err, options);
                    callback(err);
                } else {
                    utils.log(('\n[' + new Date().toUTCString() + '] ').bold + ('Successfully used the ' + info.name + ' middleware: ').green + consoleName.underline, false, options);
                    callback(null);
                }
            });
        }
    };

module.exports = function onTickFactory(options, callback) {
    var saveMiddlewareOption = options.saveMiddleware,
        // prevent onCompleteCallback from being called twice since webshot may
        // call the callback function multiple times 
        // (ex: when using stream with timeouts)
        callbackCalled = false,
        onCompleteCallback = function(err) {
            if (callbackCalled || options.error) {
                utils.logError(err, options);
                return;
            }
            if (!err) {
                utils.log(('\n[' + new Date().toUTCString() + '] ').bold + ('Successfully used all middleware! ').green.bold, false, options);
            }

            callbackCalled = true;
            callback(err);
        };

    webshot(options.url, options, function(err, readStream) {
        err = err || options.error;

        var funcs;

        if (err) {
            utils.logError(err, options);
            onCompleteCallback(err);
            return;
        }

        if (saveMiddlewareOption) {
            if (utils.isFunction(saveMiddlewareOption)) {
                saveMiddleware({
                    'middleware': saveMiddlewareOption,
                    'options': options,
                    'readStream': readStream
                }, onCompleteCallback);
            } else if (utils.isArray(saveMiddlewareOption)) {
                funcs = saveMiddlewareOption.map(function(currentMiddleware) {
                    return function(cb) {
                        if (utils.isObject(currentMiddleware) && utils.isFunction(currentMiddleware.middleware)) {
                            saveMiddleware({
                                'middleware': currentMiddleware.middleware,
                                'options': currentMiddleware.options && utils.isObject(currentMiddleware.options) ? utils.mergeOptions(options, currentMiddleware.options) : options,
                                'readStream': readStream
                            }, function(err) {
                                if (callbackCalled || options.error) {
                                    // prevent the execution of the next middleware if the 
                                    // onCompleteCallback has already been called
                                    cb(new Error('Callback already called'));
                                    return;
                                }
                                cb(err);
                            });
                        } else if (utils.isFunction(currentMiddleware)) {
                            saveMiddleware({
                                'middleware': currentMiddleware,
                                'options': options,
                                'readStream': readStream
                            }, function(err) {
                                if (callbackCalled || options.error) {
                                    // prevent the execution of the next middleware if the 
                                    // onCompleteCallback has already been called
                                    cb(new Error('Callback already called'));
                                    return;
                                }
                                cb(err);
                            });
                        }
                    };
                });

                if (funcs && funcs.length) {
                    async.series(funcs, onCompleteCallback);
                } else {
                    onCompleteCallback(new Error('No middleware is being used'));
                }
            }
        }
    });
};