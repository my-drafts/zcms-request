#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *   GET = {field: [value, ...], ...},
 *   get(field, indexInField)
 * }
 *
 * */

const zt = require('ztype');

const object2encoding = require('./object2encoding');
const object2keyIndex = require('./object2keyIndex');

const OPTIONS = {
	amount: 100,      // get fields amount: 100
	encoding: 'utf8', // get fields data encoding: utf8
	size: 8*1024      // get fields data summery size: 8kb
};

const get = function(zrequest){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const r = 'GET';
	return function(key, index){
		return object2keyIndex(R[r], key, index, true);
	};
};

const ZRequestGet = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = Object.assign({}, OPTIONS, options);
	R.GET = {};
	R.get = get(R);
	Object.freeze(R.get);
	const r = 'query';
	return new Promise(function(resolve, reject){
		if (O.size>0 && JSON.stringify(R[r]).length>O.size){
			reject(new Error('Request query data too big'));
		}
		else if(O.amount>0 && Object.keys(R[r]).length>O.amount){
			reject(new Error('Request query data has too many keys'));
		}
		else{
			// application/x-www-form-urlencoded
			R.GET = Object.assign({}, object2encoding(R[r], o.encoding));
			Object.freeze(R.GET);
			resolve(R);
		}
	});
};

module.exports = ZRequestGet;
