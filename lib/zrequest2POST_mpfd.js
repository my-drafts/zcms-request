#!/usr/bin/env node
'use strict';

const multiparty = require('multiparty');
const zt = require('ztype');

const ZUpload = require('./ZUpload');

// Fields:
// {
//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
//   'fieldName2': [ ... ],
//   ...
// }

// Upload:
// {
//   'fieldName1': [
//     {
//       'fieldName': 'fieldName1',
//       'originalFilename': 'originalFilename1',
//       'path': 'temporaryFilePath1',
//       'headers': {
//         'content-disposition': 'form-data; name="f2.2"; filename="1-image-margin-boxes-large-opt.jpg"',
//         'content-type': 'mime1',
//         ...
//       },
//       'size': 24496
//     },
//     ...
//   ],
//   'fieldName2': [ ... ],
//   ...
// }

const options2multipart = function(options){
	return {
		autoFields: true,
		autoFiles: true,
		encoding: options.encoding || 'utf8',
		maxFieldsSize: options.size,
		maxFields: options.amount,
		maxFilesSize: options.space || 0,
		uploadDir: options.directory || 'tmp/upload'
	};
};

// multipart/form-data
const zrequest2POST_mpfd = function(zrequest, options){
	const R = zt.al(zrequest, { o: zrequest, else: {} });
	const O = zt.al(options, { o: options2multipart, else: {} });
	return new Promise(function(resolve, reject){
		const form = new multiparty.Form(O);
		form.parse (R.request, function(error, fields, files){
			if(error){
				reject(error);
			}
			else{
				const upload = Object.keys(files).map(function(fieldName){
					const fieldFiles = files[fieldName].map(function(file){
						return new ZUpload(file);
					});
					return { [fieldName]: fieldFiles };
				});
				const POST = Object.assign.apply({}, [fields]);
				const UPLOAD = Object.assign.apply({}, upload);
				resolve({ post: POST, upload: UPLOAD });
			}
		});
	});
};

module.exports = zrequest2POST_mpfd;
