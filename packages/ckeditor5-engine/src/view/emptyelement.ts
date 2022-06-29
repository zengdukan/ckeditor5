/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module engine/view/emptyelement
 */

import Element from './element';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

import type AttributeElement from './attributeelement';
import type ContainerElement from './containerelement';
import type Document from './document';
import type DocumentFragment from './documentfragment';
import type DocumentSelection from './documentselection';
import type EditableElement from './editableelement';
import type Node from './node';
import type Position from './position';
import type Range from './range';
import type RawElement from './rawelement';
import type RootEditableElement from './rooteditableelement';
import type Selection from './selection';
import type Text from './text';
import type TextProxy from './textproxy';
import type UIElement from './uielement';

/**
 * Empty element class. It is used to represent elements that cannot contain any child nodes (for example `<img>` elements).
 *
 * To create a new empty element use the
 * {@link module:engine/view/downcastwriter~DowncastWriter#createEmptyElement `downcastWriter#createEmptyElement()`} method.
 *
 * @extends module:engine/view/element~Element
 */
export default class EmptyElement extends Element {
	public readonly getFillerOffset: () => null;

	/**
	 * Creates new instance of EmptyElement.
	 *
	 * Throws {@link module:utils/ckeditorerror~CKEditorError CKEditorError} `view-emptyelement-cannot-add` when third parameter is passed,
	 * to inform that usage of EmptyElement is incorrect (adding child nodes to EmptyElement is forbidden).
	 *
	 * @see module:engine/view/downcastwriter~DowncastWriter#createEmptyElement
	 * @protected
	 * @param {module:engine/view/document~Document} document The document instance to which this element belongs.
	 * @param {String} name Node name.
	 * @param {Object|Iterable} [attrs] Collection of attributes.
	 * @param {module:engine/view/node~Node|Iterable.<module:engine/view/node~Node>} [children]
	 * A list of nodes to be inserted into created element.
	 */
	constructor(
		document: Document,
		name: string,
		attributes?: Record<string, string> | Iterable<[ string, string ]>,
		children?: Node | Iterable<Node>
	) {
		super( document, name, attributes, children );

		/**
		 * Returns `null` because filler is not needed for EmptyElements.
		 *
		 * @method #getFillerOffset
		 * @returns {null} Always returns null.
		 */
		this.getFillerOffset = getFillerOffset;
	}

	public override is( type: 'node' | 'view:node' ):
		this is
			Node | Element | AttributeElement | ContainerElement | EditableElement |
			EmptyElement | RawElement | RootEditableElement | UIElement;

	public override is( type: 'element' | 'view:element' ): this is Element;
	public override is( type: 'attributeElement' | 'view:attributeElement' ): this is AttributeElement;
	public override is( type: 'containerElement' | 'view:containerElement' ): this is ContainerElement;
	public override is( type: 'editableElement' | 'view:editableElement' ): this is EditableElement;
	public override is( type: 'emptyElement' | 'view:emptyElement' ): this is EmptyElement;
	public override is( type: 'rawElement' | 'view:rawElement' ): this is RawElement;
	public override is( type: 'rootElement' | 'view:rootElement' ): this is RootEditableElement;
	public override is( type: 'uiElement' | 'view:uiElement' ): this is UIElement;
	public override is( type: 'documentFragment' | 'view:documentFragment' ): this is DocumentFragment;
	public override is( type: '$text' | 'view:$text' ): this is Text;
	public override is( type: '$textProxy' | 'view:$textProxy' ): this is TextProxy;
	public override is( type: 'position' | 'view:position' ): this is Position;
	public override is( type: 'range' | 'view:range' ): this is Range;
	public override is( type: 'selection' | 'view:selection' ): this is Selection;
	public override is( type: 'documentSelection' | 'view:documentSelection' ): this is DocumentSelection;

	public override is<N extends string>( type: 'element' | 'view:element', name: N ):
		this is (
			Element | AttributeElement | ContainerElement | EditableElement | EmptyElement | RawElement | RootEditableElement | UIElement
		) & { name: N };
	public override is<N extends string>( type: 'attributeElement' | 'view:attributeElement', name: N ):
		this is ( AttributeElement ) & { name: N };
	public override is<N extends string>( type: 'containerElement' | 'view:containerElement', name: N ):
		this is ( ContainerElement ) & { name: N };
	public override is<N extends string>( type: 'editableElement' | 'view:editableElement', name: N ):
		this is ( EditableElement ) & { name: N };
	public override is<N extends string>( type: 'emptyElement' | 'view:emptyElement', name: N ):
		this is ( EmptyElement ) & { name: N };
	public override is<N extends string>( type: 'rawElement' | 'view:rawElement', name: N ):
		this is ( RawElement ) & { name: N };
	public override is<N extends string>( type: 'rootElement' | 'view:rootElement', name: N ):
		this is ( RootEditableElement ) & { name: N };
	public override is<N extends string>( type: 'uiElement' | 'view:uiElement', name: N ):
		this is ( UIElement ) & { name: N };

	/**
	 * Checks whether this object is of the given.
	 *
	 *		emptyElement.is( 'emptyElement' ); // -> true
	 *		emptyElement.is( 'element' ); // -> true
	 *		emptyElement.is( 'node' ); // -> true
	 *		emptyElement.is( 'view:emptyElement' ); // -> true
	 *		emptyElement.is( 'view:element' ); // -> true
	 *		emptyElement.is( 'view:node' ); // -> true
	 *
	 *		emptyElement.is( 'model:element' ); // -> false
	 *		emptyElement.is( 'documentFragment' ); // -> false
	 *
	 * Assuming that the object being checked is an empty element, you can also check its
	 * {@link module:engine/view/emptyelement~EmptyElement#name name}:
	 *
	 *		emptyElement.is( 'element', 'img' ); // -> true if this is a img element
	 *		emptyElement.is( 'emptyElement', 'img' ); // -> same as above
	 *		text.is( 'element', 'img' ); -> false
	 *
	 * {@link module:engine/view/node~Node#is Check the entire list of view objects} which implement the `is()` method.
	 *
	 * @param {String} type Type to check.
	 * @param {String} [name] Element name.
	 * @returns {Boolean}
	 */
	public override is( type: string, name?: string ): boolean {
		if ( !name ) {
			return type === 'emptyElement' || type === 'view:emptyElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'element' || type === 'view:element' ||
				type === 'node' || type === 'view:node';
		} else {
			return name === this.name && (
				type === 'emptyElement' || type === 'view:emptyElement' ||
				type === 'element' || type === 'view:element'
			);
		}
	}

	/**
	 * Overrides {@link module:engine/view/element~Element#_insertChild} method.
	 * Throws {@link module:utils/ckeditorerror~CKEditorError CKEditorError} `view-emptyelement-cannot-add` to prevent
	 * adding any child nodes to EmptyElement.
	 *
	 * @protected
	 */
	public override _insertChild( index: number, items: any ): never {
		/**
		 * Cannot add children to {@link module:engine/view/emptyelement~EmptyElement}.
		 *
		 * @error view-emptyelement-cannot-add
		 */
		throw new CKEditorError(
			'view-emptyelement-cannot-add',
			[ this, items ]
		);
	}
}

// Returns `null` because block filler is not needed for EmptyElements.
//
// @returns {null}
function getFillerOffset() {
	return null;
}
