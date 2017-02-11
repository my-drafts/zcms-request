#!/usr/bin/env node
'use strict';

const url = require('url');
const zt = require('ztype');

const object2query = function(q){
	return Object.assign({}, q);
};

const request2query = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const U = url.parse(R.url, true);
	const Q = zt.al(U.query, { o: object2query, else: {} });
	const query = Object.keys(Q).length>0 ? Q : _default;
	return query;
};

module.exports = request2query;
