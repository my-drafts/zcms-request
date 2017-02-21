#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *   COOKIE = {key: [value, ...], ...},
 *   cookie(key, indexInKey)
 * }
 *
 * */

const zt = require('ztype');

const object2encoding = require('./object2encoding');
const object2keyIndex = require('./object2keyIndex');

const OPTIONS = {
	amount: 100,      // cookie fields amount: 100
	encoding: 'utf8', // cookie fields data encoding: utf8
	size: 8*1024      // cookie fields data summery size: 8kb
};

const cookie = function(zrequest){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const r = 'COOKIE';
	return function(key, index){
		return object2keyIndex(R[r], key, index, true);
	};
};

const ZRequestCookie = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = Object.assign({}, OPTIONS, options);
	R.COOKIE = {};
	R.cookie = cookie(R);
	Object.freeze(R.cookie);
	const r = 'cookies';
	return new Promise(function(resolve, reject){
		if (O.size>0 && JSON.stringify(R[r]).length>O.size){
			reject(new Error('Request cookies data too big'));
		}
		else if(O.amount>0 && Object.keys(R[r]).length>O.amount){
			reject(new Error('Request cookies data has too many keys'));
		}
		else{
			R.COOKIE = Object.assign({}, object2encoding(R[r], o.encoding));
			Object.freeze(R.COOKIE);
			resolve(R);
		}
	});
};

module.exports = ZRequestCookie;
