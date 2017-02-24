#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *  acceptTypes = [{mime: '*', q: 1, subtype: '', type: '*'}, ...],
 *  acceptCharsets = [{charset: '*', q: 1}, ...],
 * 	acceptEncodings = [{encoding: '*', q: 1}, ...],
 * 	acceptLanguages = [{language: '*', local: '*', location: '*', q: 1}, ...],
 *  c = statusCode
 *  cc = cookies
 *  code = statusCode
 *  contentTypes = {mime: '-/-', subtype: '-', type: '-', key: value, ...},
 * 	cookies = {key: value, ...},
 *  d = directory
 *  dir = directory
 * 	directory = '/',
 *  h = host
 * 	headers = {key: value, ...},
 *  hh = headers
 * 	host = '*',
 * 	httpVersion = '?',
 *  f = file
 * 	file = '',
 *  m = method
 *  message = statusMessage
 * 	method = '*',
 *  n = port
 *  number = port
 *  p = path
 * 	path = '/',
 * 	paths = ['directory1', 'directory2', ..., 'file'],
 * 	port = 0,
 *  pp = paths
 *  r = request
 * 	request = request,
 * 	query = {key: value, ...},
 * 	statusCode = 0,
 * 	statusMessage = '',
 * 	userAgent = {agent: '?', userAgent: ''},
 *  constructor(request){}
 * }
 *
 * */

const http = require('http');
const uf = require('util').format;
const ZRequestWrapper = require('zrequest');
const zt = require('ztype');

const ZRequestCookie = require('./ZRequestCookie');
const ZRequestGet = require('./ZRequestGet');
const ZRequestPost = require('./ZRequestPost');

class ZRequest extends ZRequestWrapper{
	get c() {
		return this.statusCode;
	}

	get cc() {
		return this.cookies;
	}

	get code() {
		return this.statusCode;
	}

	get d() {
		return this.directory;
	}

	get dir() {
		return this.directory;
	}

	get h() {
		return this.host;
	}

	get hh() {
		return this.headers;
	}

	get f() {
		return this.file;
	}

	get m() {
		return this.method;
	}

	get message() {
		return this.statusMessage;
	}

	get n() {
		return this.port;
	}

	get number() {
		return this.port;
	}

	get p() {
		return this.path;
	}

	get pp() {
		return this.paths;
	}

	get r() {
		return this.request;
	}

	constructor(request){
		super(request);
	}

	final(){
		const R = this;
		return Promise.resolve()
			.then(function(){
				return R.uploadClean();
			})
			.then(function(){
				return R;
			});
	}

	init(options){
		const O = zt.al(options, { o: options, else: {} });
		const R = this;
		return Promise.resolve()
			.then(function(){
				return ZRequestCookie(R, O.cookie);
			})
			.then(function(){
				return ZRequestGet(R, O.get);
			})
			.then(function(){
				if(/^post$/i.test(R.method)){
					return ZRequestPost(R, O.post);
				}
				else{
					return Promise.resolve();
				}
			})
			.then(function(){
				return R;
			});
	}

	toString(){
		const uri = uf('//%s:%s%s', this.host, this.port, this.path);
		return uf('[%s] %s %j', this.method, uri, this.query);
	}
}

module.exports = ZRequest;
