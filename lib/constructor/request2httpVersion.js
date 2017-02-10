#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const request2httpVersion = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const V = zt.al(R.httpVersion, { s: R.httpVersion, else: '' });
	const vesion = V.length>0 ? V : _default;
	return vesion;
};

module.exports = request2httpVersion;
