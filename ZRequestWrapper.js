#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const request2headers = require('./lib/request2headers');
const request2host = require('./lib/request2method');
const request2httpVersion = require('./lib/request2httpVersion');
const request2method = require('./lib/request2method');
const request2path = require('./lib/request2path');
const request2port = require('./lib/request2port');
const request2query = require('./lib/request2query');
const request2statusCode = require('./lib/request2statusCode');
const request2statusMessage = require('./lib/request2statusMessage');

const request2GET = require('./lib/zrequest2GET');
const request2POSTandUPLOAD = require('./lib/zrequest2POST');

const re = [
	/^(.*[\/])([^\/]*)$/i,
	/^[\/](.*?)[\/]?$/i
];

class ZRequestWrapper{
/** /
	get c(){ return this.statusCode; }
	get d(){ return this.directory; }
	get h(){ return this.host; }
	get hh(){ return this.headers; }
	get f(){ return this.file; }
	get m(){ return this.method; }
	get p(){ return this.path; }
	get pp(){ return this.pathAsList; }
	get r() { return this.request; }
	get q(){ return this.query; }
/** /
	get H(){ return this.headers; }
	get P(){ return this.pathAsList; }
	get R() { return this.request; }
	get Q(){ return this.query; }
/** /
	get dir(){ return this.directory; }
	get plist(){ return this.pathAsList; }
	get ver(){ return this.httpVersion; }
/** /
	get code() { return this.statusCode; }
	get message() { return this.statusMessage; }
	get version(){ return this.httpVersion; }
/**/
	get directory(){ return this._directory; }
	get headers(){ return Object.assign({}, this._headers); }
	get host(){ return this._host; }
	get httpVersion(){ return this._httpVersion; }
	get file(){ return this._file; }
	get method(){ return this._method; }
	get path(){ return this._path; }
	get pathAsList(){ return this.path.replace(re[1], '$1').split('/'); }
	get port(){ return this._port; }
	get request() { return this._request; }
	get query(){ return Object.assign({}, this._query); }
	get statusCode() { return this._statusCode; }
	get statusMessage() { return this._statusMessage; }

	constructor(request){
		if(!zt.as(request).has('IncomingMessage')){
			throw 'wrong request';
		}
		else{
			this._request = request;
			Object.seal(this._request);
		}

		this._headers = request2headers(request, {});
		Object.freeze(this._headers);

		this._host = request2host(request, '*');
		Object.freeze(this._host);

		this._httpVersion = request2httpVersion(request, '?');
		Object.freeze(this._httpVersion);

		this._method = request2method(request, '*');
		Object.freeze(this._method);

		this._path = request2path(request, '*');
		Object.freeze(this._path);

		this._port = request2port(request, '*');
		Object.freeze(this._port);

		this._query = request2query(request, {});
		Object.freeze(this._query);

		this._statusCode = request2statusCode(request, 0);
		Object.freeze(this._statusCode);

		this._statusMessage = request2statusMessage(request, '');
		Object.freeze(this._statusMessage);

		this._directory = this._path.replace(re[0], '$1');
		Object.freeze(this._directory);

		this._file = this._path.replace(re[0], '$2');
		Object.freeze(this._file);
	}

	run(options){
		const o = zt.al(options, { o: options, else: {} });
		return Promise.resolve(o)
			.then(function(o){
				const og = zt.al(o.get, { o: o.get, else: {} });
				return request2GET(this, og);
			})
			.then(function(){
				return o;
			})
			.then(function(o){
				const op = zt.al(o.get, { o: o.post, else: {} });
				return request2POSTandUPLOAD(this, op);
			})
			.then(function(){
				return o;
			});

	}
}

module.exports = ZRequestWrapper;

