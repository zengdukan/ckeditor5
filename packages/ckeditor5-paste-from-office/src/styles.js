/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global window */

/**
 * @module paste-from-office/styles
 */

export function inlineStyles( sheets, document ) {
	const stylesArray = sortStyles( sheets.flatMap( sheet => parseSheet( sheet ) ) );

	for ( const { selector, style } of stylesArray ) {
		for ( const element of document.querySelectorAll( selector ) ) {
			const oldStyle = parseCssText( element.getAttribute( 'style' ) );

			// The styles are applied with decreasing priority so we do not want
			// to overwrite the existing properties.
			const newStyle = extend( {}, oldStyle, style );

			element.setAttribute( 'style', writeCssText( newStyle ) );
		}
	}
}

function parseSheet( sheet ) {
	const parsedStyles = [];
	const rules = sheet.cssRules;

	for ( let i = 0; i < rules.length; i++ ) {
		// To detect if the rule contains styles and is not an at-rule, it's enough to check rule's type.
		if ( rules[ i ].type == window.CSSRule.STYLE_RULE ) {
			const cssText = rules[ i ].cssText;
			const startIndex = cssText.indexOf( '{' );
			const endIndex = cssText.indexOf( '}' );

			parsedStyles.push( {
				selector: rules[ i ].selectorText,
				style: parseCssText( cssText.substring( startIndex + 1, endIndex ), true )
			} );
		}
	}

	return parsedStyles;
}

function parseCssText( styleText, normalize ) {
	const result = {};

	if ( !styleText ) {
		return result;
	}

	styleText.replace( /&quot;/g, '"' ).replace( /\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, ( match, name, value ) => {
		if ( normalize ) {
			name = name.toLowerCase();

			// Drop extra whitespaces from font-family.
			if ( name == 'font-family' ) {
				value = value.replace( /\s*,\s*/g, ',' );
			}

			value = value.trim();
		}

		result[ name ] = value;
	} );

	return result;
}

function writeCssText( styles, sort ) {
	const stylesArr = [];

	for ( const name in styles ) {
		stylesArr.push( name + ':' + styles[ name ] );
	}

	if ( sort ) {
		stylesArr.sort();
	}

	return stylesArr.join( '; ' );
}

function sortStyles( stylesArray ) {
	// Returns comparison function which sorts all selectors in a way that class selectors are ordered
	// before the rest of the selectors. The order of the selectors with the same specificity
	// is reversed so that the most important will be applied first.
	function getCompareFunction( styles ) {
		const order = styles.map( item => item.selector );

		return ( style1, style2 ) => {
			const value1 = isClassSelector( style1.selector ) ? 1 : 0;
			const value2 = isClassSelector( style2.selector ) ? 1 : 0;
			const result = value2 - value1;

			// If the selectors have same specificity, the latter one should
			// have higher priority (goes first).
			return result != 0 ? result : order.indexOf( style2.selector ) - order.indexOf( style1.selector );
		};
	}

	// True if given CSS selector contains a class selector.
	function isClassSelector( selector ) {
		return String( selector ).includes( '.' );
	}

	return stylesArray.sort( getCompareFunction( stylesArray ) );
}

function extend( target, ...sources ) {
	for ( const source of sources ) {
		for ( const [ key, value ] of Object.entries( source ) ) {
			// Do not override existing properties.
			if ( target[ key ] == null ) {
				target[ key ] = value;
			}
		}
	}

	return target;
}
