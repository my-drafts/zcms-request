#!/usr/bin/env node
'use strict';

const multiparty = require('multiparty');
const qs = require('querystring').stringify;
const zt = require('ztype');

const ZUpload = require('./run/ZUpload');

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

// multipart/form-data
const request2POST = function(request, options){
	const R = zt.al(request, { o: request, else: {} });
	const o = Object.assign({}, OPTIONS, options);

	const r = zt.al(R.request, { o: R.request, else: false });
	const formOptions = {
		autoFields: true,
		autoFiles: true,
		encoding: o.encoding,
		maxFieldsSize: o.size,
		maxFields: o.amount,
		maxFilesSize: o.space,
		uploadDir: o.directory
	};
	const form = new multiparty.Form(formOptions);
	return new Promise(function(resolve, reject){
		form.parse (r, function(error, fields, files){
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
