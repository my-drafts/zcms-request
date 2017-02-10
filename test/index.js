#!/usr/bin/env node
'use strict';

const http = require('http');
const ZRequest = require('../');
const zt = require('ztype');

http.createServer(function(request, response){
	let req = new ZRequest(request);
	//Promise.all([
	console.log(req);
}).listen(8080);
