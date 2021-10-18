/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global window */

/**
 * @module paste-from-office/styles
 */

const filtered = [
	'break-before',
	'break-after',
	'break-inside',
	'page-break',
	'page-break-before',
	'page-break-after',
	'page-break-inside'
];

function parseSheet( sheet ) {
	function getStyles( cssText ) {
		const startIndex = cssText.indexOf( '{' );
		const endIndex = cssText.indexOf( '}' );

		return parseCssText( cssText.substring( startIndex + 1, endIndex ), true );
	}

	const parsedStyles = [];
	const rules = sheet.cssRules;

	for ( let i = 0; i < rules.length; i++ ) {
		// To detect if the rule contains styles and is not an at-rule, it's enough to check rule's type.
		if ( rules[ i ].type === window.CSSRule.STYLE_RULE ) {
			parsedStyles.push( {
				selector: rules[ i ].selectorText,
				styles: filterStyles( getStyles( rules[ i ].cssText ) )
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

function filterStyles( stylesObj ) {
	const toRemove = filtered;
	const newObj = {};

	for ( const style in stylesObj ) {
		if ( !toRemove.includes( style ) ) {
			newObj[ style ] = stylesObj[ style ];
		}
	}

	return newObj;
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
		return String( selector ).indexOf( '.' ) != -1;
	}

	return stylesArray.sort( getCompareFunction( stylesArray ) );
}

export function inlineStyles( sheets, document ) {
	const stylesArray = sortStyles( sheets.flatMap( sheet => parseSheet( sheet ) ) );

	function applyStyle( document, selector, style ) {
		for ( const element of document.querySelectorAll( selector ) ) {
			const oldStyle = parseCssText( element.getAttribute( 'style' ) );

			// The styles are applied with decreasing priority so we do not want
			// to overwrite the existing properties.
			const newStyle = extend( {}, oldStyle, style );

			element.setAttribute( 'style', writeCssText( newStyle ) );
		}
	}

	stylesArray.forEach( style => {
		applyStyle( document, style.selector, style.styles );
	} );
}

function extend( target, ...sources ) {
	for ( const source of sources ) {
		Object.keys( source ).forEach( propertyName => {
			// Only copy existed fields if in overwrite mode.
			if ( target[ propertyName ] == null ) {
				target[ propertyName ] = source[ propertyName ];
			}
		} );
	}

	return target;
}
