#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const zr2g = require('./zrequest2GET_uefd');

const OPTIONS = {
	amount: 100,      // get fields amount: 100
	encoding: 'utf8', // get fields data encoding: utf8
	size: 8*1024      // get fields data summery size: 8kb
};

var cookie = function(zrequest){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	return function(key, index){
		const get2value = function(g, i){
			return g[(i % g.length + g.length) % g.length];
		};
		const get2index = function(g){
			const g2v = function(i){
				return get2value(g, i);
			};
			//return zt.al(index, { n: g2v, else: g });
			// return all with out index as array
			return zt.al(index, { n: g2v, else: [g] });
		};
		const get2key = function(G){
			// return zt.al(G[key], { a: get2index, else: G[key] });
			// return all with out index as array
			return zt.al(G[key], { a: get2index, else: [G[key]] });
		};
		return zt.al(R.GET, { o: get2key, else: undefined });
	};
};

var cookies = function(zrequest){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const cookie2amount = function(C){
		return Object.keys(C);
	};
	return function(){
		return zt.al(R.COOKIE, { o: cookie2amount, else: 0 });
	};
};

const request2COOKIE = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = Object.assign({}, OPTIONS, options);
	R.COOKIE = {};
	R.cookie = get(R);
	R.cookies = gets(R);
	Object.freeze(R.cookie);
	Object.freeze(R.cookies);
	return zr2g(R, O).then(function(GET){
		R.GET = Object.assign(R.GET, GET);
		return R;
	});
};

module.exports = request2COOKIE;
