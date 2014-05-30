var CronJob = require('cron').CronJob,
	webshot = require('webshot'),
	grunt = require('grunt'),
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

// hack to avoid loading a Gruntfile
// You can skip this and just use a Gruntfile instead
grunt.task.init = function() {};

// Init config
grunt.initConfig({
	asset_deploy: {
		options: {
			src: 'screenshot.png',
			host: 'playground.yahoofs.com',
			path: '/gfranko/'
			// yca: 'yahoo.mobstor.client.some.property'
		}
	}
});

// Load tasks
grunt.loadNpmTasks('grunt-asset-deploy');

grunt.registerTask('blah', function() {
	console.log('yoooo');
})

cronshot.run({
	'onTick': function() {
		webshot('http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores', 'screenshot.png', function(err) {
			if(!err) {
				// grunt.tasks('asset_deploy');
				grunt.util.spawn({
					'grunt': true,
					'args': ['blah', 'asset_deploy']
				});
			} else {
				console.log('error: ', err);
			}
		});
	}
});