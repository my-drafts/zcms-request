#!/usr/bin/env node
'use strict';

const http = require('http');
const url = require('url');
const uf = require('util').format;
const zt = require('ztype');

const request2method = function(request, _default){
	_default = _default || '*';
	const _2method = function(m){
		return m.trim().toLowerCase();
	};
	let R = zt.al(request, { o:request, else: {} });
	let M = zt.al(R.method, { s:_2method, else:'' });
	let method = M.length>0 ? M : _default;
	return method;
};

const request2host = function(request, _default){
	_default = _default || '*';
	const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;
	const _2host = function(h){
		return h.trim().toLowerCase().replace(re, '$1');
	};
	let R = zt.al(request, { o:request, else: {} });
	let HH = zt.al(R.headers, { o:R.headers, else:{} });
	let H = zt.al(HH.host, { s:_2host, else:'' });
	let host = H.length>0 ? H : _default;
	return host;
};

const request2port = function(request, _default){
	_default = _default || '*';
	const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;
	const _2port = function(p){
		return p.trim().toLowerCase().replace(re, '$2');
	};
	let R = zt.al(request, { o:request, else: {} });
	let HH = zt.al(R.headers, { o:R.headers, else:{} });
	let P = zt.al(HH.host, { s:_2port, else:'' });
	let port = P.length>0 ? (Number(P)>0 ? Number(P) : P) : _default;
	return port;
};

const request2path = function(request, _default){
	_default = _default || '*';
	const ref = /^.+?[\.][^\.]+$/ig;
	const _2pm = function(path, index){
		return path.trim();
	};
	const _2pf = function(path, index){
		return path.length>0;
	};
	const _2p = function(p){
		return [].concat([''], p, p.length>0 && ref.test(p[p.length-1]) ? [] : ['']);
	};
	const _2path = function(p){
		return _2p(p.toLowerCase().split('/').map(_2pm).filter(_2pf));
	};
	let R = zt.al(request, { o:request, else:{} });
	let U = url.parse(R.url, true);
	let P = zt.al(U.pathname, { s:_2path, else:[] });
	let path = P.length>0 ? P.join('/') : _default;
	return path;
};

const request2query = function(request, _default){
	_default = _default || {};
	const _2query = function(q){
		return Object.assign({}, q);
	}
	let R = zt.al(request, { o:request, else:{} });
	let U = url.parse(R.url, true);
	let Q = zt.al(U.query, { o:_2query, else:{} });
	let query = Object.keys(Q).length>0 ? Q : _default;
	return query;
};

class ZRequest extends http.IncomingMessage{
	constructor(request){
		super(request);
		let THIS = this, R = request;
		let zrl = zt.pl(this);
		console.log(zrl);
		for(let i=THIS; i.__proto__; i=i.__proto__){
			if(!i.__proto__.__proto__){
				i.__proto__.__proto__ = request;
				break;
			}
		}
		this.x = 123;

	}
}

const zrequest = function(request, options){
	let zr = {};
	zr.__proto__ = request;
	return zr;
};

module.exports = zrequest;

