#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const request2statusMessage = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const SM = zt.al(R.statusMessage, { s: R.statusMessage, else: '' });
	const statusMessage = SM.length>0 ? SM : _default;
	return statusMessage;
};

module.exports = request2statusMessage;
