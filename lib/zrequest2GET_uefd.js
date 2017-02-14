#!/usr/bin/env node
'use strict';

const up = require('url').parse;
const zt = require('ztype');

const uefd = function(query, encoding, it){
	const Q = query;
	if(zt.as(Q).a){
		return Q.map(function(q){
			return uefd(q, encoding, it + 1);
		});
	}
	else if(zt.as(Q).s){
		const data = decodeURI(Q);
		const buffer = new Buffer(data, encoding);
		const result = buffer.toString();
		return it===1 ? [result] : result;
	}
	else if(zt.as(Q).o){
		const items = Object.keys(Q).map(function(q){
			const key = uefd(q, encoding, 0);
			const value = uefd(Q[q], encoding, it+1);
			return { [ key ]: value };
		});
		const result = Object.assign.apply({}, items);
		return it===1 ? [result] : result;
	}
	else{
		const result = decodeURI(Q);
		return it===1 ? [result] : result;
	}
};

// application/x-www-form-urlencoded
const zrequest2GET_uefd = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = zt.al(options, { o: options, else: {} });
	return new Promise(function(resolve, reject){
		const uq = up(R.request.url).query;
		const Q = zt.al(R.query, { o: R.query, else: {} });
		if (O.size>0 && uefd(uq, O.encoding, 0).length>O.size){
			reject(new Error('Request query string too big'));
		}
		else if(O.amount>0 && Object.keys(Q).length>O.amount){
			reject(new Error('Request query string has too many keys'));
		}
		else{
			resolve(uefd(Q, o.encoding, 0));
		}
	});
};

module.exports = zrequest2GET_uefd;
