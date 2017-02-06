#!/usr/bin/env node
'use strict';

const http = require('http');
const zrequest = require('../');
const zt = require('ztype');

class Y{
	constructor(){
		this.y = 4321;
	}
}

class X{
	constructor(){
		this.x = 123;
	}
}

var x = new X();
console.log(x, zt.as(x).cids);
var y = new Y();
console.log(y, zt.as(y).cids);
x.__proto__.__proto__ = y;
console.log(x, zt.as(x, { l:false }).cids, Object.keys(x), x.x, x.y);
console.log(y, zt.as(y).cids, Object.keys(y), y.x, y.y);


/** /
http.createServer(function(req, res){
	let q = zrequest(req);
	console.log(q);
}).listen(8080);
/**/