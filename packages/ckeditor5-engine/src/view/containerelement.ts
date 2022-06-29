/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module engine/view/containerelement
 */

import Element from './element';

import type AttributeElement from './attributeelement';
import type DocumentFragment from './documentfragment';
import type DocumentSelection from './documentselection';
import type EditableElement from './editableelement';
import type EmptyElement from './emptyelement';
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
 * Containers are elements which define document structure. They define boundaries for
 * {@link module:engine/view/attributeelement~AttributeElement attributes}. They are mostly used for block elements like `<p>` or `<div>`.
 *
 * Editing engine does not define a fixed HTML DTD. This is why a feature developer needs to choose between various
 * types (container element, {@link module:engine/view/attributeelement~AttributeElement attribute element},
 * {@link module:engine/view/emptyelement~EmptyElement empty element}, etc) when developing a feature.
 *
 * The container element should be your default choice when writing a converter, unless:
 *
 * * this element represents a model text attribute (then use {@link module:engine/view/attributeelement~AttributeElement}),
 * * this is an empty element like `<img>` (then use {@link module:engine/view/emptyelement~EmptyElement}),
 * * this is a root element,
 * * this is a nested editable element (then use  {@link module:engine/view/editableelement~EditableElement}).
 *
 * To create a new container element instance use the
 * {@link module:engine/view/downcastwriter~DowncastWriter#createContainerElement `DowncastWriter#createContainerElement()`}
 * method.
 *
 * @extends module:engine/view/element~Element
 */
export default class ContainerElement extends Element {
	public readonly getFillerOffset: () => number | null;

	/**
	 * Creates a container element.
	 *
	 * @see module:engine/view/downcastwriter~DowncastWriter#createContainerElement
	 * @see module:engine/view/element~Element
	 * @protected
	 * @param {module:engine/view/document~Document} document The document instance to which this element belongs.
	 * @param {String} name Node name.
	 * @param {Object|Iterable} [attrs] Collection of attributes.
	 * @param {module:engine/view/node~Node|Iterable.<module:engine/view/node~Node>} [children]
	 * A list of nodes to be inserted into created element.
	 */
	constructor( ...args: ConstructorParameters<typeof Element> ) {
		super( ...args );

		/**
		 * Returns block {@link module:engine/view/filler filler} offset or `null` if block filler is not needed.
		 *
		 * @method #getFillerOffset
		 * @returns {Number|null} Block filler offset or `null` if block filler is not needed.
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
	 *		containerElement.is( 'containerElement' ); // -> true
	 *		containerElement.is( 'element' ); // -> true
	 *		containerElement.is( 'node' ); // -> true
	 *		containerElement.is( 'view:containerElement' ); // -> true
	 *		containerElement.is( 'view:element' ); // -> true
	 *		containerElement.is( 'view:node' ); // -> true
	 *
	 *		containerElement.is( 'model:element' ); // -> false
	 *		containerElement.is( 'documentFragment' ); // -> false
	 *
	 * Assuming that the object being checked is a container element, you can also check its
	 * {@link module:engine/view/containerelement~ContainerElement#name name}:
	 *
	 *		containerElement.is( 'element', 'div' ); // -> true if this is a div container element
	 *		containerElement.is( 'contaienrElement', 'div' ); // -> same as above
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
			return type === 'containerElement' || type === 'view:containerElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'element' || type === 'view:element' ||
				type === 'node' || type === 'view:node';
		} else {
			return name === this.name && (
				type === 'containerElement' || type === 'view:containerElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'element' || type === 'view:element'
			);
		}
	}
}

/**
 * Returns block {@link module:engine/view/filler filler} offset or `null` if block filler is not needed.
 *
 * @returns {Number|null} Block filler offset or `null` if block filler is not needed.
 */
function getFillerOffset( this: ContainerElement ): number | null {
	const children = [ ...this.getChildren() ];
	const lastChild = children[ this.childCount - 1 ];

	// Block filler is required after a `<br>` if it's the last element in its container. See #1422.
	if ( lastChild && lastChild.is( 'element', 'br' ) ) {
		return this.childCount;
	}

	for ( const child of children ) {
		// If there's any non-UI element – don't render the bogus.
		if ( !child.is( 'uiElement' ) ) {
			return null;
		}
	}

	// If there are only UI elements – render the bogus at the end of the element.
	return this.childCount;
}
