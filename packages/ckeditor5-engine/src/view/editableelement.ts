/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module engine/view/editableelement
 */

import ContainerElement from './containerelement';
import mix from '@ckeditor/ckeditor5-utils/src/mix';
import { default as ObservableMixin, type Observable } from '@ckeditor/ckeditor5-utils/src/observablemixin';

import type AttributeElement from './attributeelement';
import type DocumentFragment from './documentfragment';
import type Element from './element';
import type EmptyElement from './emptyelement';
import type Node from './node';
import type Position from './position';
import type RawElement from './rawelement';
import type RootEditableElement from './rooteditableelement';
import type Text from './text';
import type TextProxy from './textproxy';
import type UIElement from './uielement';

/**
 * Editable element which can be a {@link module:engine/view/rooteditableelement~RootEditableElement root}
 * or nested editable area in the editor.
 *
 * Editable is automatically read-only when its {@link module:engine/view/document~Document Document} is read-only.
 *
 * The constructor of this class shouldn't be used directly. To create new `EditableElement` use the
 * {@link module:engine/view/downcastwriter~DowncastWriter#createEditableElement `downcastWriter#createEditableElement()`} method.
 *
 * @extends module:engine/view/containerelement~ContainerElement
 * @mixes module:utils/observablemixin~ObservableMixin
 */
class EditableElement extends ContainerElement {
	public isReadOnly!: boolean;
	public isFocused!: boolean;

	/**
	 * Creates an editable element.
	 *
	 * @see module:engine/view/downcastwriter~DowncastWriter#createEditableElement
	 * @protected
	 */
	constructor( ...args: ConstructorParameters<typeof Element> ) {
		super( ...args );

		const document = args[ 0 ];

		/**
		 * Whether the editable is in read-write or read-only mode.
		 *
		 * @observable
		 * @member {Boolean} module:engine/view/editableelement~EditableElement#isReadOnly
		 */
		this.set( 'isReadOnly', false );

		/**
		 * Whether the editable is focused.
		 *
		 * This property updates when {@link module:engine/view/document~Document#isFocused document.isFocused} or view
		 * selection is changed.
		 *
		 * @readonly
		 * @observable
		 * @member {Boolean} module:engine/view/editableelement~EditableElement#isFocused
		 */
		this.set( 'isFocused', false );

		this.bind( 'isReadOnly' ).to( document );

		this.bind( 'isFocused' ).to(
			document,
			'isFocused',
			isFocused => isFocused && document.selection.editableElement == this
		);

		// Update focus state based on selection changes.
		this.listenTo( document.selection, 'change', () => {
			this.isFocused = document.isFocused && document.selection.editableElement == this;
		} );
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
	 *		editableElement.is( 'editableElement' ); // -> true
	 *		editableElement.is( 'element' ); // -> true
	 *		editableElement.is( 'node' ); // -> true
	 *		editableElement.is( 'view:editableElement' ); // -> true
	 *		editableElement.is( 'view:element' ); // -> true
	 *		editableElement.is( 'view:node' ); // -> true
	 *
	 *		editableElement.is( 'model:element' ); // -> false
	 *		editableElement.is( 'documentFragment' ); // -> false
	 *
	 * Assuming that the object being checked is an editbale element, you can also check its
	 * {@link module:engine/view/editableelement~EditableElement#name name}:
	 *
	 *		editableElement.is( 'element', 'div' ); // -> true if this is a div element
	 *		editableElement.is( 'editableElement', 'div' ); // -> same as above
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
			return type === 'editableElement' || type === 'view:editableElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'containerElement' || type === 'view:containerElement' ||
				type === 'element' || type === 'view:element' ||
				type === 'node' || type === 'view:node';
		} else {
			return name === this.name && (
				type === 'editableElement' || type === 'view:editableElement' ||
				// From super.is(). This is highly utilised method and cannot call super. See ckeditor/ckeditor5#6529.
				type === 'containerElement' || type === 'view:containerElement' ||
				type === 'element' || type === 'view:element'
			);
		}
	}

	public destroy(): void {
		this.stopListening();
	}
}

mix( EditableElement, ObservableMixin );

interface EditableElement extends Observable {}

export default EditableElement;
