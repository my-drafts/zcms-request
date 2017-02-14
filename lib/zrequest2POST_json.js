#!/usr/bin/env node
'use strict';

const zt = require('ztype');

// application/json
const zrequest2POST_json = function(zrequest, options){
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
			const data = JSON.parse(body.toString());
			if(O.amount>0 && zt.as(data).o && Object.keys(data).length>O.amount){
				reject(new Error('Request body has too many keys'));
			}
			else if(O.amount>0 && zt.as(data).a && data.length>O.amount){
				reject(new Error('Request body has too many elements'));
			}
			else{
				resolve(data);
			}
		});
	});
};

module.exports = zrequest2POST_json;
