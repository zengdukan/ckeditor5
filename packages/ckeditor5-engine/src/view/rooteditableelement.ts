/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module engine/view/rooteditableelement
 */

import EditableElement from './editableelement';

import type AttributeElement from './attributeelement';
import type ContainerElement from './containerelement';
import type DocumentFragment from './documentfragment';
import type Element from './element';
import type EmptyElement from './emptyelement';
import type Node from './node';
import type Position from './position';
import type RawElement from './rawelement';
import type Text from './text';
import type TextProxy from './textproxy';
import type UIElement from './uielement';

const rootNameSymbol = Symbol( 'rootName' );

/**
 * Class representing a single root in the data view. A root can be either {@link ~RootEditableElement#isReadOnly editable or read-only},
 * but in both cases it is called "an editable". Roots can contain other {@link module:engine/view/editableelement~EditableElement
 * editable elements} making them "nested editables".
 *
 * @extends module:engine/view/editableelement~EditableElement
 */
export default class RootEditableElement extends EditableElement {
	/**
	 * Creates root editable element.
	 *
	 * @param {module:engine/view/document~Document} document The document instance to which this element belongs.
	 * @param {String} name Node name.
	 */
	constructor(
		document: ConstructorParameters<typeof Element>[ 0 ],
		name: ConstructorParameters<typeof Element>[ 1 ]
	) {
		super( document, name );

		/**
		 * Name of this root inside {@link module:engine/view/document~Document} that is an owner of this root. If no
		 * other name is set, `main` name is used.
		 *
		 * @readonly
		 * @member {String}
		 */
		this.rootName = 'main';
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
	 *		rootEditableElement.is( 'rootElement' ); // -> true
	 *		rootEditableElement.is( 'editableElement' ); // -> true
	 *		rootEditableElement.is( 'element' ); // -> true
	 *		rootEditableElement.is( 'node' ); // -> true
	 *		rootEditableElement.is( 'view:editableElement' ); // -> true
	 *		rootEditableElement.is( 'view:element' ); // -> true
	 *		rootEditableElement.is( 'view:node' ); // -> true
	 *
	 *		rootEditableElement.is( 'model:element' ); // -> false
	 *		rootEditableElement.is( 'documentFragment' ); // -> false
	 *
	 * Assuming that the object being checked is a root editable element, you can also check its
	 * {@link module:engine/view/rooteditableelement~RootEditableElement#name name}:
	 *
	 *		rootEditableElement.is( 'element', 'div' ); // -> true if this is a div root editable element
	 *		rootEditableElement.is( 'rootElement', 'div' ); // -> same as above
	 *		text.is( 'element', 'div' ); -> false
	 *
	 * {@link module:engine/view/node~Node#is Check the entire list of view objects} which implement the `is()` method.
	 *
	 * @param {String} type Type to check.
	 * @param {String} [name] Element name.
	 * @returns {Boolean}
	 */
	public override is( type: string, name?: string ): boolean {
		if ( !name ) {
			return type === 'rootElement' || type === 'view:rootElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'editableElement' || type === 'view:editableElement' ||
				type === 'containerElement' || type === 'view:containerElement' ||
				type === 'element' || type === 'view:element' ||
				type === 'node' || type === 'view:node';
		} else {
			return name === this.name && (
				type === 'rootElement' || type === 'view:rootElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'editableElement' || type === 'view:editableElement' ||
				type === 'containerElement' || type === 'view:containerElement' ||
				type === 'element' || type === 'view:element'
			);
		}
	}

	public get rootName(): string {
		return this.getCustomProperty( rootNameSymbol ) as string;
	}

	public set rootName( rootName: string ) {
		this._setCustomProperty( rootNameSymbol, rootName );
	}

	/**
	 * Overrides old element name and sets new one.
	 * This is needed because view roots are created before they are attached to the DOM.
	 * The name of the root element is temporary at this stage. It has to be changed when the
	 * view root element is attached to the DOM element.
	 *
	 * @protected
	 * @param {String} name The new name of element.
	 */
	public set _name( name: string ) {
		this.name = name;
	}
}
