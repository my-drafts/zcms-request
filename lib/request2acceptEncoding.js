#!/usr/bin/env node
'use strict';

const zt = require('ztype');

// TODO: retuern format
const string2accept = function(a){
	return a.trim().toLowerCase();
};

const request2acceptEncoding = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const A = zt.al(HH['accept-encoding'], { s: string2accept, else: '' });
	const accept = A.length>0 ? A : _default;
	return accept;
};

module.exports = request2acceptEncoding;
