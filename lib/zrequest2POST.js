#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const r2p_json = require('./zrequest2POST_json');
const r2p_mpfd = require('./zrequest2POST_mpfd');
const r2p_tpfd = require('./zrequest2POST_tpfd');
const r2p_uefd = require('./zrequest2POST_uefd');

const POST_OPTIONS = {
	amount: 1000,            // post fields amount: 1000
	encoding: 'utf8',        // post fields data encoding: utf8
	size: 2*1024*1024        // post fields data size: 2mb
};

const UPLOAD_OPTIONS = {
	directory: 'tmp/upload', // post upload directory: tmp/upload
	space: 'Infinity'        // post upload space size: Infinity
};

const post = function(request){
	const R = zt.al(request, { o: request, else: {} });
	return function(key, index){
		const post2value = function(p, i){
			return p[(i%p.length + p.length) % p.length];
		};
		const post2index = function(p){
			const p2v = function(i){
				return post2value(p, i);
			};
			return zt.al(index, { n: p2v, else: p });
		};
		const post2key = function(P){
			return zt.al(P[key], { a: post2index, else: P[key] });
		};
		return zt.al(R.POST, { o: post2key, else: undefined });
	};
};

const posts = function(request){
	const R = zt.al(request, { o: request, else: {} });
	const post2amount = function(P){
		return Object.keys(P);
	};
	return function(){
		return zt.al(R.POST, { o: post2amount, else: 0 });
	};
};

const upload = function(request){
	const R = zt.al(request, { o: request, else: {} });
	return function(key, index){
		const upload2value = function(u, i){
			return u[(i % u.length + u.length) % u.length];
		};
		const upload2index = function(u){
			const u2v = function(i){
				return upload2value(u, i);
			};
			return zt.al(index, { n: u2v, else: u });
		};
		const upload2key = function(U){
			return zt.al(U[key], { a: upload2index, else: U[key] });
		};
		return zt.al(R.UPLOAD, { o: upload2key, else: undefined });
	};
};

const uploads = function(request){
	const R = zt.al(request, { o: request, else: {} });
	const upload2amount = function(U){
		return Object.keys(U);
	};
	return function(){
		return zt.al(R.UPLOAD, { o: upload2amount, else: 0 });
	};
};

const request2POST = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = Object.assign({}, POST_OPTIONS, UPLOAD_OPTIONS, options);
	const r2pu = function(PU){
		R.POST = Object.assign(R.POST, PU.POST);
		R.UPLOAD = Object.assign(R.UPLOAD, PU.UPLOAD);
		return R;
	};
	const r2p = function(P){
		R.POST = Object.assign(R.POST, P);
		return R;
	};
	R.POST = {};
	R.UPLOAD = {};
	R.post = post(R);
	R.posts = posts(R);
	R.upload = upload(R);
	R.uploads = uploads(R);
	Object.freeze(R.post);
	Object.freeze(R.posts);
	Object.freeze(R.upload);
	Object.freeze(R.uploads);
	switch(R.headers['content-type']){
		case 'multipart/form-data':
			return r2p_mpfd(R, O).then(r2pu);
		case 'application/json':
			return r2p_json(R, O).then(r2p);
		case 'application/x-www-form-urlencoded':
			return r2p_uefd(R, O).then(r2p);
		case 'text/plain':
			return r2p_tpfd(R, O).then(r2p);
		default:
			return Promise.resolve(R);
	}
};

module.exports = request2POST;
