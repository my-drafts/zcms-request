#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const re = /^(?:[\s]*(.*?)[\s]*[\=])?[\s]*(.*?)[\s]*$/ig;

const string2cookie = function(c){
	return c.split(';')
		.map(function(cookie){
			return (new Buffer(cookie, 'ascii')).toString('utf8');
		})
		.map(function(cookie){
			return re.exec(cookie);
		})
		.filter(function(cookie){
			return cookie[1];
		})
		.map(function(cookie){
			return { name: cookie[1].trim(), value: cookie[2].trim() };
		});
};

const request2cookieList = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const C = zt.al(HH.cookie, { s: string2cookie, else: [] });
	const cookieList = C.length>0 ? C : _default;
	return cookieList;
};

module.exports = request2cookieList;
