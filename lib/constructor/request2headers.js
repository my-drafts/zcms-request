#!/usr/bin/env node
'use strict';

const zt = require('ztype');


const object2headers = function(h){
	const headersMap = function(header){
		const key = header.toLowerCase();
		const value = String(h[header]).toLowerCase();
		return { [key]: value };
	};
	const H = Object.keys(h).map(headersMap);
	return Object.assign.apply({}, H);
};

const request2headers = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const H = zt.al(R.headers, { o: object2headers, else: {} });
	const headers = H.length>0 ? H : _default;
	return headers;
};

module.exports = request2headers;
