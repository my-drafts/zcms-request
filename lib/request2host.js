#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;

const string2host = function(h){
	return h.trim().toLowerCase().replace(re, '$1');
};

const request2host = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const H = zt.al(HH.host, { s: string2host, else: '' });
	const host = H.length>0 ? H : _default;
	return host;
};

module.exports = request2host;
