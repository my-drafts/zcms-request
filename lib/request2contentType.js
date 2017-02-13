#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const string2type = function(t){
	return t.trim().toLowerCase();
};

const request2contentType = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const T = zt.al(HH['content-type'], { s: string2type, else: '' });
	const type = T.length>0 ? T : _default;
	return type;
};

module.exports = request2contentType;
