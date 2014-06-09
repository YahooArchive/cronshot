/*  onTickFactory: return onTick function for cronjob given cronshot options 
 *  ENSURES: returns a function that handles onTick events 
 */
var saveToMobstor = require('./saveToMobstor'),
	webshot = require('../forked_libs/webshot/lib/webshot');

module.exports = exports = function onTickFactory(options) {
	webshot(options.url, options.imageName, options, function(err) {
	  if(err)
	    return utils.logError(err);
	  saveToMobstor(options);
	});
};