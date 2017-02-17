#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const OPTIONS = {
	amount: 100,      // cookie fields amount: 100
	encoding: 'utf8', // cookie fields data encoding: utf8
	size: 8*1024      // cookie fields data summery size: 8kb
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

const zr2c = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = zt.al(options, { o: options, else: {} });
	return new Promise(function(resolve, reject){
		if (O.size>0 && R.cookieString.length>O.size){
			reject(new Error('Request cookie string too big'));
		}
		else if(O.amount>0 && R.cookieList.length>O.amount){
			reject(new Error('Request query string has too many keys'));
		}
		else{
			resolve(uefd(Q, o.encoding, 0));
		}
	});
};

const zrequest2COOKIE = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = Object.assign({}, OPTIONS, options);
	R.COOKIE = {};
	R.cookie = cookie(R);
	R.cookies = cookies(R);
	Object.freeze(R.cookie);
	Object.freeze(R.cookies);
	return zr2c(R, O).then(function(GET){
		R.GET = Object.assign(R.GET, GET);
		return R;
	});
};

module.exports = zrequest2COOKIE;
