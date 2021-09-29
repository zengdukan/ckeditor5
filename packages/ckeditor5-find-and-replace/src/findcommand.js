/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module find-and-replace/findcommand
*/

import { Command } from 'ckeditor5/src/core';
import { updateFindResultFromRange, findByTextCallback } from './utils';

/**
 * The find command. It is used by the {@link module:find-and-replace/findandreplace~FindAndReplace find and replace feature}.
 *
 * @extends module:core/command~Command
 */
export default class FindCommand extends Command {
	/**
	 * Creates a new `FindCommand` instance.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor on which this command will be used.
	 * @param {module:find-and-replace/findandreplacestate~FindAndReplaceState} state An object to hold plugin state.
	 */
	constructor( editor, state ) {
		super( editor );

		// The find command is always enabled.
		// this.isEnabled = true;

		// TODO: affectsContent
		this.set( 'affectsContent', false );

		/**
		 * The find and replace state object used for command operations.
		 *
		 * @private
		 * @member {module:find-and-replace/findandreplacestate~FindAndReplaceState} #_state
		 */
		this._state = state;

		// Do not block the command if the editor goes into the read-only mode as it does not impact the data. See #9975.
		// this.listenTo( editor, 'change:isReadOnly', () => {
		// 	this.clearForceDisabled( 'readOnlyMode' );
		// } );
	}

	/**
	 * Executes the command.
	 *
	 * @param {Function|String} callbackOrText
	 * @param {Object} [options]
	 * @param {Boolean} [options.matchCase=false] If set to `true`, the letter case will be matched.
	 * @param {Boolean} [options.wholeWords=false] If set to `true`, only whole words that match `callbackOrText` will be matched.
	 *
	 * @fires execute
	 */
	execute( callbackOrText, { matchCase, wholeWords } = {} ) {
		const { editor } = this;
		const { model } = editor;

		let findCallback;

		// Allow to execute `find()` on a plugin with a keyword only.
		if ( typeof callbackOrText === 'string' ) {
			findCallback = findByTextCallback( callbackOrText, { matchCase, wholeWords } );

			this._state.searchText = callbackOrText;
		} else {
			findCallback = callbackOrText;
		}

		// Initial search is done on all nodes in all roots inside the content.
		const results = model.document.getRootNames()
			.reduce( ( ( currentResults, rootName ) => updateFindResultFromRange(
				model.createRangeIn( model.document.getRoot( rootName ) ),
				model,
				findCallback,
				currentResults
			) ), null );

		this._state.clear( model );
		this._state.results.addMany( Array.from( results ) );
		this._state.highlightedResult = results.get( 0 );

		if ( typeof callbackOrText === 'string' ) {
			this._state.searchText = callbackOrText;
		}

		this._state.matchCase = !!matchCase;
		this._state.matchWholeWords = !!wholeWords;

		return {
			results,
			findCallback
		};
	}
}
