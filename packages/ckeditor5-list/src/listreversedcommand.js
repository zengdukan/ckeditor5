/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module list/listreversedcommand
 */

import { Command } from 'ckeditor5/src/core';
import { getListItemsOfSelectedList } from './utils';

/**
 * The list reversed command. It is used by the {@link module:list/liststyle~ListStyle list style feature}.
 *
 * @extends module:core/command~Command
 */
export default class ListReversedCommand extends Command {
	/**
	* @inheritDoc
	*/
	refresh() {
		this.value = this._getValue();
		this.isEnabled = this._checkEnabled();
	}

	/**
	* Executes the command.
	*
	* @param {Object} options
	* @param {Boolean} [options.reversed=false] Whether the list should be reversed.
	* @protected
	*/
	execute( options = {} ) {
		const model = this.editor.model;
		const listItems = getListItemsOfSelectedList( model )
			.filter( item => item.getAttribute( 'listType' ) == 'numbered' );

		model.change( writer => {
			for ( const item of listItems ) {
				writer.setAttribute( 'listReversed', !!options.reversed, item );
			}
		} );
	}

	/**
	* Checks the command's {@link #value}.
	*
	* @private
	* @returns {Boolean|null} The current value.
	*/
	_getValue() {
		const listItem = this.editor.model.document.selection.getFirstPosition().parent;

		if ( listItem && listItem.is( 'element', 'listItem' ) && listItem.getAttribute( 'listType' ) == 'numbered' ) {
			return listItem.getAttribute( 'listReversed' );
		}

		return null;
	}

	/**
	 * Checks whether the command can be enabled in the current context.
	 *
	 * @private
	 * @returns {Boolean} Whether the command should be enabled.
	 */
	_checkEnabled() {
		const editor = this.editor;

		const numberedList = editor.commands.get( 'numberedList' );

		return numberedList.isEnabled;
	}
}
