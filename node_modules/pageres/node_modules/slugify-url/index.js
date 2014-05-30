"use strict";

module.exports = slugify_url;

var defaultOptions = {
	slashChar: '!',
	maxLength: 100,
	skipProtocol: true,
	skipUserPass: true
};

function getOptions(_options) {
	if (typeof(_options) !== 'object') {
		return defaultOptions;
	}

	var options = {};
	for (var _key in defaultOptions) {
		if (typeof(_options[_key]) !== 'undefined') {
			options[_key] = _options[_key];
		} else {
			options[_key] = defaultOptions[_key];
		}
	}
	return options;
}

function slugify_url(url, _options) {
	/* Must be a string representation of an URL */
	if (typeof(url) !== 'string') {
		return null;
	}

	var sanitized = url;
	var options = getOptions(_options);
	
	/* skip protocol part */
	if (options.skipProtocol) {
		sanitized = sanitized.replace(/^[\w]+:\/\//, '');
	}
	
	/* skip user/pass part */
	if (options.skipUserPass) {
		sanitized = sanitized.replace(/[\w\-_\.]+(:[^@]+)?@/, '');
	}
	
	/* skip slashes for slashChar */
	sanitized = sanitized.replace(/\//g, options.slashChar);
	
	/* truncate to max length */
	sanitized = sanitized.substr(0, options.maxLength);

	return sanitized;
}
