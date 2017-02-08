#!/usr/bin/env node
'use strict';

const http = require('http');
const zrequest = require('../');
const zt = require('ztype');

http.createServer(function(req, res){
	let q = zrequest(req);
	console.log(q, q.url);
}).listen(8080);
