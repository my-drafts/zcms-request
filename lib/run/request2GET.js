#!/usr/bin/env node
'use strict';

const qs = require('querystring').stringify;
const zt = require('ztype');

const OPTIONS = {
	amount: 100,      // get fields amount: 100
	encoding: 'utf8', // get fields data encoding: utf8
	size: 8*1024      // get fields data summery size: 8kb
};

var get = function(request){
	const R = zt.al(request, { o: request, else: {} });
	return function(key, index){
		const get2value = function(g, i){
			return g[(i % g.length + g.length) % g.length];
		};
		const get2index = function(g){
			const g2v = function(i){
				return get2value(g, i);
			};
			return zt.al(index, { n: g2v, else: g });
		};
		const get2key = function(G){
			return zt.al(G[key], { a: get2index, else: G[key] });
		};
		return zt.al(R.GET, { o: get2key, else: undefined });
	};
};

var gets = function(request){
	const R = zt.al(request, { o: request, else: {} });
	const get2amount = function(G){
		return Object.keys(G);
	};
	return function(){
		return zt.al(R.GET, { o: get2amount, else: 0 });
	};
};

// application/x-www-form-urlencoded
const request2GET = function(request, options){
	const R = zt.al(request, { o: request, else: {} });
	const o = Object.assign({}, OPTIONS, options);
	R.GET = {};
	R.get = get(request);
	R.gets = gets(request);
	Object.freeze(R.get);
	Object.freeze(R.gets);

	return new Promise(function(resolve, reject){
		const Q = zt.al(R.query, { o: R.query, else: {} });
		if (o.size>0 && (new Buffer(qs(Q), o.encoding)).length>o.size){
			reject(new Error('Request query string too big'));
		}
		else if(o.amount>0 && Object.keys(Q).length>o.amount){
			reject(new Error('Request query string too many keys'));
		}
		else{
			const items = Object.keys(Q).map(function(q){
				const key = new Buffer(q, o.encoding);
				const value = new Buffer(Q[key], o.encoding);
				return { [key]: value };
			});
			R.GET = Object.assign.apply(R.GET, items);
			//Object.freeze(R.GET);
			resolve(request);
		}
	});
};

module.exports = request2GET;
