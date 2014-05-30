var CronJob = require('cron').CronJob,
	webshot = require('webshot'),
	fs = require('fs'),
	mobstor = require('mobstor'),
	cron = {
		'run': function(obj) {
			var cronPattern = obj.cronPattern || '*/10 * * * * *',
				noop = function() {},
				onTick = obj.onTick || noop,
				onComplete = obj.onComplete || noop,
				context = obj.context || this,
				start = obj.start || true,
				timeZone = obj.timeZone || '',
				job = new CronJob({
					'cronTime': cronPattern,
					'onTick': onTick,
					'onComplete': onComplete,
					'start': start,
					'timeZone': timeZone
				});
		}
	},
	cronshot = module.exports = {
		run: function(obj) {
			cron.run(obj);
		}
	};

cronshot.run({
	'onTick': function() {
		webshot('http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores', 'screenshot.png', {
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
			'quality': 100,
			'streamType': 'png',
			'siteType': 'url',
			'renderDelay': 0,
			'timeout': 0,
			'takeShotOnCallback': false,
			'errorIfStatusIsNot200': false
		}, function(err) {
			if(!err) {

				var content = fs.createReadStream('screenshot.png'),
					config = {
						host : "playground.yahoofs.com"
					},
					client;

				client = mobstor.createClient(config);
				client.storeFile('/gfranko/screenshot.png', content, function mobstorStoreFileCb(err) {
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
	}
});