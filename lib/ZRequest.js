#!/usr/bin/env node
'use strict';

const http = require('http');
const uf = require('util').format;
const zt = require('ztype');

const request2accept = require('./request2accept');
const request2acceptEncoding = require('./request2acceptEncoding');
const request2acceptLanguage = require('./request2acceptLanguage');
const request2agent = require('./request2agent');
const request2contentType = require('./request2contentType');
const request2cookieList = require('./request2cookieList');
const request2headers = require('./request2headers');
const request2host = require('./request2host');
const request2httpVersion = require('./request2httpVersion');
const request2method = require('./request2method');
const request2path = require('./request2path');
const request2port = require('./request2port');
const request2query = require('./request2query');
const request2statusCode = require('./request2statusCode');
const request2statusMessage = require('./request2statusMessage');
const request2userAgent = require('./request2userAgent');

const zrequest2GET = require('./zrequest2GET');
const zrequest2POST = require('./zrequest2POST');

const re = [
	/^(.*[\/])([^\/]*)$/i,
	/^[\/](.*?)[\/]?$/i
];

class ZRequest{
/**/
	get a(){ return this.agent; }
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
	get t(){ return this.type; }
/**/
	get H(){ return this.headers; }
	get P(){ return this.pathAsList; }
	get R() { return this.request; }
	get Q(){ return this.query; }
/**/
	get dir(){ return this.directory; }
	get plist(){ return this.pathAsList; }
	get ver(){ return this.httpVersion; }
/**/
	get code() { return this.statusCode; }
	get message() { return this.statusMessage; }
	get type() { return this.contentType; }
	get version(){ return this.httpVersion; }
/**/
	get accept(){ return this._accept; }
	get acceptEncoding(){ return this._acceptEncoding; }
	get acceptLanguage(){ return this._acceptLanguage; }
	get agent(){ return this._agent; }
	get contentType(){ return this._contentType; }
	get cookieList(){ return this._cookieList; }
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
	get userAgent() { return this._userAgent; }

	constructor(request){
		if(!zt.as(request).has('IncomingMessage')){
			throw 'wrong request';
		}
		else{
			this._request = request;
			Object.seal(this._request);
		}

		this._accept = request2accept(request, '*/*');
		Object.freeze(this._accept);

		this._acceptEncoding = request2acceptEncoding(request, '*');
		Object.freeze(this._acceptEncoding);

		this._acceptLanguage = request2acceptLanguage(request, '*');
		Object.freeze(this._acceptLanguage);

		this._agent = request2agent(request, '?');
		Object.freeze(this._agent);

		this._contentType = request2contentType(request, '-/-');
		Object.freeze(this._contentType);

		this._cookieList = request2cookieList(request, []);
		Object.freeze(this._cookieList);

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

		this._userAgent = request2userAgent(request, '');
		Object.freeze(this._userAgent);

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
				return zrequest2GET(this, og);
			})
			.then(function(){
				return o;
			})
			.then(function(o){
				const op = zt.al(o.get, { o: o.post, else: {} });
				return zrequest2POST(this, op);
			})
			.then(function(){
				return o;
			});
	}

	toString(){
		const H = this.host;
		const M = this.method;
		const P = this.path;
		const p = this.port;
		const Q = this.query;
		const q = Object.keys(Q).length>0 ? uf(' %j', Q) : '';
		return uf.apply(null, ['[%s] %s:%s%s%s', M, H, p, P, q]);
	}
}

module.exports = ZRequest;

