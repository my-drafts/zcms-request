#!/usr/bin/env node
'use strict';

const http = require('http');
const uf = require('util').format;
const zt = require('ztype');

const request2GET = require('./lib/zrequest2GET');

const ZRequestWrapper = require('./ZRequestWrapper');

class ZRequest extends ZRequestWrapper{
	constructor(request){
		super(request);
		Object.freeze(this);
	}

	toString(){
		let q = Object.keys(this.q).length>0 ? uf(' %j', this.q) : '';
		return uf('[%s] %s:%s%s%s', this.m, this.h, this.port, this.p, q);
	}

	run(options){
		return Promise.all([
			request2GET(this, options['get'])
		]);
	}
}

module.exports = ZRequest;
