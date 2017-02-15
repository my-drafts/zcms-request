#!/usr/bin/env node
'use strict';

const zt = require('ztype');

class X extends Array{
	constructor(x){
		super(1, 2, 3);
		const THIS = this;
		x.forEach(function(x){
			THIS.push(x);
		})
	}
}

let x = new X([5, 6, 7]);
console.log(x, zt.as(x), zt.like(x), x.constructor.name, zt.like(X), X.constructor.name, X.prototype.constructor.name);

return ;

const http = require('http');
const ZRequest = require('../').ZRequest;

http.createServer(function(request, response){
	let req = new ZRequest(request);
	console.log(req);
}).listen(8080);
