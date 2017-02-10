#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;

const string2port = function(p){
	return p.trim().toLowerCase().replace(re, '$2');
};

const request2port = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const P = zt.al(HH.host, { s: string2port, else: '' });
	const port = P.length>0 ? (Number(P)>0 ? Number(P) : P) : _default;
	return port;
};

module.exports = request2port;
