#!/usr/bin/env node

'use strict';

const http = require('http');
const ZRequest = require('../').ZRequest;
const zt = require('ztype');

http.createServer(function(request, response){
	let req = new ZRequest(request);
	console.log(String(req));
	req.init().then(function(){
		console.log(String(req));
	});
}).listen(8080);
