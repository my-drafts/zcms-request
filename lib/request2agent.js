#!/usr/bin/env node
'use strict';

const zt = require('ztype');

// https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
const string2agent = function(a){
	if (a.match(/Firefox[\/][\.\d]+/i) && !a.match(/Seamonkey[\/][\.\d]+/i)) {
		return 'firefox';
	}
	else if (a.match(/Seamonkey[\/][\.\d]+/i)){
		return 'seamonkey';
	}
	else if (a.match(/Chrome[\/][\.\d]+/i) && !a.match(/Chromium[\/][\.\d]+/i)) {
		return 'chrome';
	}
	else if (a.match(/Chromium[\/][\.\d]+/i)) {
		return 'chromium';
	}
	else if (a.match(/Safari[\/][\.\d]+/i) && !a.match(/(?:Chrome|Chromium)[\/][\.\d]+/i)) {
		return 'safari';
	}
	else if (a.match(/(?:Opera|OPR)[\/][\.\d]+/i)) {
		return 'opera';
	}
	else if (a.match(/[\;]MSIE[\s]*[\.\d]+[\;]/i)) {
		return 'ie';
	}
	else {
		return '';
	}
};

const request2agent = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const A = zt.al(HH['user-agent'], { s: string2agent, else: '' });
	const agent = A.length>0 ? A : _default;
	return agent;
};

module.exports = request2agent;
