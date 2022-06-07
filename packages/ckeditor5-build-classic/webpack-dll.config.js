/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const glob = require( 'glob' );
const TerserPlugin = require( 'terser-webpack-plugin' );

const editorConfig = {
	devtool: 'source-map',

	performance: { hints: false },

	entry: path.resolve( __dirname, 'src', 'ckeditor-dll.js' ),

	output: {
		library: [ 'CKEditor5', 'builds', 'ClassicEditor' ],
		path: path.resolve( __dirname, 'build' ),
		filename: 'ckeditor-dll.js',
		libraryTarget: 'window',
		libraryExport: 'default'
	},

	optimization: {
		minimizer: [
			new TerserPlugin( {
				sourceMap: true,
				terserOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/
					}
				},
				extractComments: false
			} )
		]
	}
};

const translationsConfig = {
	performance: { hints: false },

	entry: groupAllTranslations(),

	output: {
		path: path.resolve( __dirname, 'build', 'translations-dll' ),
		filename: '[name].js'
	}
};

function groupAllTranslations() {
	const names = [
		'ckeditor5',
		'ckeditor5-collaboration',
		'@ckeditor/ckeditor5-*'
	];

	const globPattern = `node_modules/{${ names.join( ',' ) }}/build/translations/*.js`;

	const globConfig = {
		absolute: true,
		cwd: path.resolve( __dirname, '..', '..' ),
		ignore: 'ckeditor5-build-*'
	};

	return glob
		.sync( globPattern, globConfig )
		.reduce( ( result, foundPath ) => {
			const language = path.basename( foundPath, '.js' );

			result[ language ] = result[ language ] || [];
			result[ language ].push( foundPath );

			return result;
		}, {} );
}

module.exports = [ editorConfig, translationsConfig ];

