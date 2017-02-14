#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/i,
	/^(.*?)[\s]*[\;][\s]*q[\=]([\d\.]+)$/i
];

// TODO: retuern format
const string2language = function(L){
	return L.trim().toLowerCase().split(re[0]).map(function(language){
		const l = re[1].test(language) ? re[1].exec(language) : false;
		return { language: l ? l[1] : language, q: l ? Number(l[2]) : 1 };
	}).sort(function(l1, l2){
		return l1.q<l2.q ? -1 : l1.q>l2.q ? 1 : 0;
	}).map(function(language){
		return language.language;
	});
};

const request2acceptLanguage = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const h = 'accept-language';
	const A = zt.al(HH[h], { s: string2language, else: '' });
	const accept = A.length>0 ? A : _default;
	Object.freeze(accept);
	return accept;
};

module.exports = request2acceptLanguage;
