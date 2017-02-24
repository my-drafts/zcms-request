#!/usr/bin/env node

'use strict';

const a = {
	b:1, a:2
};

console.log(Object.keys(a));

for(let x in a){
	console.log(x, a[x]);
}

const http = require('http');
const ZRequest = require('../').ZRequest;
const zt = require('ztype');

http.createServer(function(request, response){
	let req = new ZRequest(request);
	console.log(req);
}).listen(8080);
