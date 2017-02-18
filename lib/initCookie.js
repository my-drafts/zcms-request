#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const OPTIONS = {
	amount: 100,      // cookie fields amount: 100
	encoding: 'utf8', // cookie fields data encoding: utf8
	size: 8*1024      // cookie fields data summery size: 8kb
};

const cookie = function(zrequest){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const r = 'cookies';
	return function(key, index){
		const _2value = function(a, i){
			return a[(i % a.length + a.length) % a.length];
		};
		const _2index = function(o){
			// return all with out index as array
			const _default = [o]; // o
			const _2v = function(i){
				return _2value(o, i);
			};
			return zt.al(index, { n: _2v, else: _default });
		};
		const _2key = function(O){
			// return all with out index as array
			const _defualt = [O[key]]; // O[key];
			return zt.al(O[key], { a: _2index, else: _defualt });
		};
		return zt.al(R[r], { o: _2key, else: undefined });
	};
};

const zr2c = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = zt.al(options, { o: options, else: {} });
	return new Promise(function(resolve, reject){
		if (O.size>0 && JSON.stringify(R.cookies).length>O.size){
			reject(new Error('Request cookie string too big'));
		}
		else if(O.amount>0 && Object.keys(R.cookies).length>O.amount){
			reject(new Error('Request query string has too many keys'));
		}
		else{
			resolve(uefd(R.cookies, o.encoding, 0));
		}
	});
};

const zrequest2COOKIE = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = Object.assign({}, OPTIONS, options);
	R.COOKIE = {};
	R.cookie = cookie(R);
	Object.freeze(R.cookie);
	return zr2c(R, O).then(function(COOKIE){
		R.COOKIE = Object.assign(R.COOKIE, COOKIE);
		return R;
	});
};

module.exports = zrequest2COOKIE;
