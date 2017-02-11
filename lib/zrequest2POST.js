#!/usr/bin/env node
'use strict';

const qs = require('querystring').stringify;
const zt = require('ztype');

const r2p_mpfd = require('./request2POST_mpfd');

const POST_OPTIONS = {
	amount: 1000,            // post fields amount: 1000
	encoding: 'utf8',        // post fields data encoding: utf8
	size: 2*1024*1024        // post fields data size: 2mb
};

const UPLOAD_OPTIONS = {
	directory: 'tmp/upload', // post upload directory: tmp/upload
	space: 'Infinity'        // post upload space size: Infinity
};

const OPTIONS = Object.assign({}, POST_OPTIONS, UPLOAD_OPTIONS);

var post = function(request){
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

var posts = function(request){
	const R = zt.al(request, { o: request, else: {} });
	const post2amount = function(P){
		return Object.keys(P);
	};
	return function(){
		return zt.al(R.POST, { o: post2amount, else: 0 });
	};
};

var upload = function(request){
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

var uploads = function(request){
	const R = zt.al(request, { o: request, else: {} });
	const upload2amount = function(U){
		return Object.keys(U);
	};
	return function(){
		return zt.al(R.UPLOAD, { o: upload2amount, else: 0 });
	};
};

const request2POSTandUPLOAD = function(request, options){
	const R = zt.al(request, { o: request, else: {} });
	const o = Object.assign({}, OPTIONS, options);

	R.POST = {};
	R.UPLOAD = {};
	R.post = post(request);
	R.posts = posts(request);
	R.upload = upload(request);
	R.uploads = uploads(request);
	Object.freeze(R.post);
	Object.freeze(R.posts);
	Object.freeze(R.upload);
	Object.freeze(R.uploads);

	const itemsMap = function(q){
		const key = new Buffer(q, o.encoding);
		const value = new Buffer(Q[key], o.encoding);
		return { [key]: value };
	};
	return new Promise(function(resolve, reject){
		if (o.size>0 && (new Buffer(qs(Q), o.encoding)).length>o.size){
			reject(new Error('Request query string too big'));
		}
		else if(o.amount>0 && Object.keys(Q).length>o.amount){
			reject(new Error('Request query string too many keys'));
		}
		else{
			const items = Object.keys(Q).map(itemsMap);
			R.POST = Object.assign.apply({}, items);
			R.post = post(request);
			R.posts = posts(request);
			Object.freeze(R.GET);
			Object.freeze(R.get);
			Object.freeze(R.gets);
			resolve(request);
		}
	});
};

module.exports = request2POST;
