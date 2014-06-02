var CronJob = require('cron').CronJob,
	webshot = require('./libs/webshot/lib/webshot'),
	fs = require('fs'),
	mobstor = require('mobstor'),
	utils = {
        'isObject': function(obj) {
            if(!obj) {
                return false;
            }
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        'isArray': function(arr) {
            if(!arr) {
                return false;
            }
            if('isArray' in Array) {
                return Array.isArray(arr);
            } else {
                return Object.prototype.toString.call(arr) === '[object Array]';
            }
        },
        'each': function(collection, callback) {
            var x, len;
            if(utils.isArray(collection)) {
                x = -1;
                len = collection.length;
                while(++x < len) {
                    if (callback(x, collection[x]) === false) {
                        break;
                    }
                }
            } else if(utils.isObject(collection)) {
                for(x in collection) {
                    if(collection.hasOwnProperty(x)) {
                        if (callback(x, collection[x]) === false) {
                            break;
                        }
                    }
                }
            }
        },
        'mergeOptions': function deepMerge(defaultOptions, userOptions) {
            if(!utils.isObject(defaultOptions) || !utils.isObject(userOptions) || !Object.keys) {
                return;
            }
            var newObj = {};

            utils.each(defaultOptions, function(key, val) {
                newObj[key] = defaultOptions[key];
            });

            utils.each(userOptions, function(key, val) {
                var currentUserOption = userOptions[key];
                if(!utils.isObject(currentUserOption)) {
                    newObj[key] = currentUserOption;
                } else {
                    if(!defaultOptions[key]) {
                        newObj[key] = currentUserOption;
                    } else {
                        newObj[key] = deepMerge(defaultOptions[key], currentUserOption);
                    }
                }
            });

            return newObj;
        },
        'noop': function noop() {}
	},
	getCommandLineOptions = function() {
		var argsObj = {};

		process.argv.forEach(function(arg, iterator) {
			if(arg.charAt(0) === '-' && arg.charAt(1) === '-') {
				argsObj[arg.substring(2, arg.length)] = process.argv[iterator + 1];
			}
		});

		return argsObj;
	},
	defaultOptions = {
		'screenSize': {
			'width': 1024,
			'height': 768
		},
		'shotSize': {
			'width': 'window',
			'height': 'window'
		},
		'shotOffset': {
			'left': 0,
			'right': 0,
			'top': 0,
			'bottom': 0
		},
		'phantomPath': 'phantomjs',
		'phantomConfig': {},
		'customHeaders': null,
		'defaultWhiteBackground': true,
		'customCSS': '',
		'quality': 75,
		'streamType': 'png',
		'siteType': 'url',
		'renderDelay': 0,
		'timeout': 0,
		'takeShotOnCallback': false,
		'errorIfStatusIsNot200': false,
		'cronPattern': '*/10 * * * * *',
		'onTick': function() {
			webshot(mergedOptions.url, mergedOptions.imageName, {
				'screenSize': mergedOptions.screenSize,
				'shotSize': mergedOptions.shotSize,
				'shotOffset': mergedOptions.shotOffset,
				'phantomPath': mergedOptions.phantomPath,
				'phantomConfig': mergedOptions.phantomConfig,
				'customHeaders': mergedOptions.customHeaders,
				'defaultWhiteBackground': mergedOptions.defaultWhiteBackground,
				'customCSS': mergedOptions.customCSS,
				'quality': mergedOptions.quality,
				'streamType': mergedOptions.streamType,
				'siteType': mergedOptions.siteType,
				'renderDelay': mergedOptions.renderDelay,
				'timeout': mergedOptions.timeout,
				'takeShotOnCallback': mergedOptions.takeShotOnCallback,
				'errorIfStatusIsNot200': mergedOptions.errorIfStatusIsNot200
			}, function(err) {
				if(!err) {

					var content = fs.createReadStream(mergedOptions.imageName),
						config = {
							host : mergedOptions.host
						},
						client;

					client = mobstor.createClient(config);

					client.storeFile(mergedOptions.mobsterPath, content, function mobstorStoreFileCb(err) {
						// skip 409 conflict issues since the asset was uploaded correctly
						if (err && err.code !== 409) {
							console.log('Failed');
						} else {
							console.log('Successfully deployed');
						}
					});

				} else {
					console.log('error: ', err);
				}
			});
		},
		'onComplete': utils.noop,
		'start': true,
		'timeZone': '',
		'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
		'imageName': 'screenshot.png',
		'host': 'playground.yahoofs.com',
		'mobsterPath': '/gfranko/screenshot.png'
	},
	cron = {
		'run': function(obj) {
			var cronPattern = obj.cronPattern,
				onTick = obj.onTick,
				onComplete = obj.onComplete,
				start = obj.start,
				timeZone = obj.timeZone,
				job = new CronJob({
					'cronTime': cronPattern,
					'onTick': onTick,
					'onComplete': onComplete,
					'start': start,
					'timeZone': timeZone
				});
		}
	},
	mergedOptions = {},
	cronshot = module.exports = {
		run: function(opts) {
			// merge default options with any command line options and passed options
			mergedOptions = utils.mergeOptions(defaultOptions, utils.mergeOptions((utils.isObject(opts) ? opts : {}), getCommandLineOptions()));
			cron.run(mergedOptions);
		},
		'webshot': webshot,
		'mobstor':  mobstor
	};