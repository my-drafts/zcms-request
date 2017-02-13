#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const string2userAgent = function(ua){
	return ua.trim().toLowerCase();
};

const request2userAgent = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const UA = zt.al(HH['user-agent'], { s: string2userAgent, else: '' });
	const userAgent = UA.length>0 ? UA : _default;
	return userAgent;
};

module.exports = request2userAgent;
