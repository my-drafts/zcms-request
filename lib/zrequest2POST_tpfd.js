#!/usr/bin/env node
'use strict';

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
			const data = body.toString().split(/[\r][\n]/i).map(function(b){
				const d = /^([^\=]*)[\=](.*)$/.exec(b);
				return d ? { key: d[1], value: d[2] } : false;
			}).filter(function(d){
				return d;
			});
			if(O.amount>0 && zt.as(data).a && data.length>O.amount){
				reject(new Error('Request body has too many elements'));
			}
			else{
				resolve(data.reduce(function(D, d){
					D[d.key] = (zt.as(D[d.key]).a ? D[d.key] : []).concat([d.value]);
					return D;
				}, {}));
			}
		});
	});
};

module.exports = request2POST_tpfd;
