#!/usr/bin/env node
'use strict';

const qs = require('querystring').stringify;
const zt = require('ztype');

// text/plain
const request2POST_tpfd = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = zt.al(options, { o: options2multipart, else: {} });
	return new Promise(function(resolve, reject){
		R.request.on('error', function(error){
			reject(error);
		});
		let body = new Buffer('', O.encoding);
		R.request.on('data', function(chunk){
			if(O.size>0 && (body.length + chunk.length)>O.size){
				R.request.connection.destroy();
				reject(new Error('Request body too big'));
			}
			else{
				body += chunk;
			}
		});
		R.request.on('end', function () {
			const data = qs.parse(body.toString());
			if(O.amount>0 && zt.as(data).a && data.length>O.amount){
				reject(new Error('Request body has too many elements'));
			}
			else{
				Object.keys(data).forEach(function(value, key){
					data[key] = zt.al(value, { a: value, else: [value] });
				});
				resolve(data);
			}
		});
	});
};

module.exports = request2POST_tpfd;
