/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

module.exports = function buildApiDocs() {
	const ckeditor5Docs = require( '@ckeditor/ckeditor5-dev-docs' );

	return ckeditor5Docs
		.build( {
			// Patterns that do not start with '/' are mounted onto process.cwd() path by default.
			readmePath: 'README.md',
			sourceFiles: [
				'packages/ckeditor5-utils/src/**/*.ts'

				// 'packages/ckeditor5-utils/src/count.ts',
				// 'packages/ckeditor5-utils/src/nth.ts'

				// 'packages/ckeditor5-utils/src/count.js',
				// 'packages/ckeditor5-utils/src/nth.js'

				// 'packages/ckeditor5-utils/src/count.js'
				// 'packages/@(ckeditor|ckeditor5)-*/src/**/*.ts',
				// '!packages/@(ckeditor|ckeditor5)-*/src/lib/**/*.ts',
				// '!packages/ckeditor5-build-*/src/**/*.ts',
				// 'external/*/packages/@(ckeditor|ckeditor5)-*/src/**/*.ts',
				// '!external/*/packages/@(ckeditor|ckeditor5)-*/src/lib/**/*.ts',
				// '!external/*/packages/ckeditor5-build-*/src/**/*.ts'
			],
			validateOnly: process.argv.includes( '--validate-only' ),
			strict: process.argv.includes( '--strict' )
		} );
};
