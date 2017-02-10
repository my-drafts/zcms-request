#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const request2statusCode = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const SC = zt.al(R.statusCode, { n: R.statusCode, else: 0 });
	const statusCode = SC>0 ? SC : _default;
	return statusCode;
};

module.exports = request2statusCode;
