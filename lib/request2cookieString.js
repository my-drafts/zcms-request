#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const re = /^(?:[\s]*(.*?)[\s]*[\=])?[\s]*(.*?)[\s]*$/ig;

const string2cookie = function(c){
	return c;
};

const request2cookieString = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const C = zt.al(HH.cookie, { s: string2cookie, else: [] });
	const cookieString = C.length>0 ? C : _default;
	return cookieString;
};

module.exports = request2cookieString;
