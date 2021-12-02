/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global window, NodeFilter */

/**
 * @module paste-from-office/styles
 */

export function inlineStyles( sheets, document ) {
	const stylesArray = sortStyles( sheets.flatMap( sheet => parseSheet( sheet ) ) );

	for ( const { selector, style } of stylesArray ) {
		parseShorthandMargins( style );

		for ( const element of document.querySelectorAll( selector ) ) {
			const oldStyle = parseCssText( element.getAttribute( 'style' ) );

			parseShorthandMargins( oldStyle );

			// The styles are applied with decreasing priority so we do not want
			// to overwrite the existing properties.
			const newStyle = extend( {}, oldStyle, style );
			element.setAttribute( 'style', writeCssText( newStyle ) );
		}
	}
}

export function filterStyles( document ) {
	const treeWalker = document.createTreeWalker( document, NodeFilter.SHOW_ELEMENT );

	let element;

	// eslint-disable-next-line no-cond-assign
	while ( element = treeWalker.nextNode() ) {
		removeSuperfluousStyles( element );
		normalizeStyles( element );
	}
}

function removeSuperfluousStyles( element ) {
	const resetStyles = [
		'background-color:transparent',
		'background:transparent',
		'background-color:none',
		'background:none',
		'background-position:initial initial',
		'background-repeat:initial initial',
		'caret-color',
		'font-family:-webkit-standard',
		'font-variant-caps',
		'letter-spacing:normal',
		'orphans',
		'widows',
		'text-transform:none',
		'word-spacing:0px',
		'-webkit-text-size-adjust:auto',
		'-webkit-text-stroke-width:0px',
		'text-indent:0px',
		'margin-bottom:0in'
	];

	const styles = parseCssText( element.getAttribute( 'style' ) );

	for ( const styleName in styles ) {
		const styleString = styleName + ':' + styles[ styleName ];

		if ( resetStyles.some( val => styleString.substring( 0, val.length ).toLowerCase() === val ) ) {
			delete styles[ styleName ];
		}
	}

	const newStyles = writeCssText( styles );

	if ( newStyles != '' ) {
		element.setAttribute( 'style', newStyles );
	} else {
		element.removeAttribute( 'style' );
	}
}

export function normalizeStyles( element ) {
	// Some styles and style values are redundant, so delete them.
	const resetStyles = [
		'background-color:transparent',
		'border-image:none',
		'color:windowtext',
		'direction:ltr',
		'mso-',
		'visibility:visible',
		'div:border:none'
	];

	const styles = parseCssText( element.getAttribute( 'style' ) );

	for ( const [ key, styleValue ] of Object.entries( styles ) ) {
		const styleName = key.toLowerCase();

		if (
			matchStyle( null, styleName, styleValue ) ||
			matchStyle( null, styleName.replace( /-.*$/, '-' ) ) ||
			matchStyle( null, styleName ) ||
			matchStyle( element.name, styleName, styleValue ) ||
			matchStyle( element.name, styleName.replace( /-.*$/, '-' ) ) ||
			matchStyle( element.name, styleName ) ||
			matchStyle( styleValue )
		) {
			delete styles[ key ];
		}
	}

	// Still some elements might have shorthand margins or longhand with zero values.
	parseShorthandMargins( styles );
	normalizeMargins();

	const cssText = writeCssText( styles );

	if ( cssText ) {
		element.setAttribute( 'style', cssText );
	} else {
		element.removeAttribute( 'style' );
	}

	function matchStyle( ...args ) {
		return resetStyles.includes( args.filter( arg => arg ).join( ':' ) );
	}

	function normalizeMargins() {
		for ( let key of [ 'top', 'right', 'bottom', 'left' ] ) {
			key = 'margin-' + key;

			if ( !( key in styles ) ) {
				continue;
			}

			// TODO: var value = CKEDITOR.tools.convertToPx( styles[ key ] );
			const value = parseFloat( styles[ key ] );

			if ( !value ) {
				delete styles[ key ];
			}
		}
	}
}

function parseSheet( sheet ) {
	// Styles skipped by the styles inliner.
	const filtered = [
		'break-before',
		'break-after',
		'break-inside',
		'page-break',
		'page-break-before',
		'page-break-after',
		'page-break-inside'
	];

	const parsedStyles = [];
	const rules = sheet.cssRules;

	for ( let i = 0; i < rules.length; i++ ) {
		// To detect if the rule contains styles and is not an at-rule, it's enough to check rule's type.
		if ( rules[ i ].type == window.CSSRule.STYLE_RULE ) {
			const cssText = rules[ i ].cssText;
			const startIndex = cssText.indexOf( '{' );
			const endIndex = cssText.indexOf( '}' );
			const styles = parseCssText( cssText.substring( startIndex + 1, endIndex ), true );

			for ( const style of Object.keys( styles ) ) {
				if ( filtered.includes( style ) ) {
					delete styles[ style ];
				}
			}

			parsedStyles.push( {
				selector: rules[ i ].selectorText,
				style: styles
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

	// Normalize colors.
	if ( styleText ) {
		styleText = normalizeHex( convertRgbToHex( styleText ) );
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

function writeCssText( styles ) {
	const stylesArr = [];

	for ( const name in styles ) {
		stylesArr.push( name + ':' + styles[ name ] );
	}

	stylesArr.sort();

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

function parseShorthandMargins( style ) {
	const marginCase = Object.keys( style ).find( key => key.toLowerCase() == 'margin' );

	if ( marginCase ) {
		const margin = parseMargin( style[ marginCase ] );

		for ( const key in margin ) {
			style[ 'margin-' + key ] = margin[ key ];
		}

		delete style[ marginCase ];
	}
}

function parseMargin( value ) {
	return sideShorthand( value, width => {
		return width.match( /-?[.\d]+(?:%|\w*)|auto|inherit|initial|unset|revert/g ) || [ '0px' ];
	} );
}

function sideShorthand( value, split ) {
	const ret = {};
	const parts = split ? split( value ) : value.split( /\s+/ );

	switch ( parts.length ) {
		case 1:
			mapStyles( [ 0, 0, 0, 0 ] );
			break;
		case 2:
			mapStyles( [ 0, 1, 0, 1 ] );
			break;
		case 3:
			mapStyles( [ 0, 1, 2, 1 ] );
			break;
		case 4:
			mapStyles( [ 0, 1, 2, 3 ] );
			break;
	}

	function mapStyles( map ) {
		ret.top = parts[ map[ 0 ] ];
		ret.right = parts[ map[ 1 ] ];
		ret.bottom = parts[ map[ 2 ] ];
		ret.left = parts[ map[ 3 ] ];
	}

	return ret;
}

function convertRgbToHex( styleText ) {
	return styleText.replace( /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, ( match, red, green, blue ) => {
		const color = [ red, green, blue ];

		// Add padding zeros if the hex value is less than 0x10.
		for ( let i = 0; i < 3; i++ ) {
			color[ i ] = ( '0' + parseInt( color[ i ], 10 ).toString( 16 ) ).slice( -2 );
		}

		return '#' + color.join( '' );
	} );
}

function normalizeHex( styleText ) {
	return styleText.replace( /#(([0-9a-f]{3}){1,2})($|;|\s+)/gi, ( match, hexColor, hexColorPart, separator ) => {
		let normalizedHexColor = hexColor.toLowerCase();

		if ( normalizedHexColor.length == 3 ) {
			const parts = normalizedHexColor.split( '' );

			normalizedHexColor = [
				parts[ 0 ], parts[ 0 ],
				parts[ 1 ], parts[ 1 ],
				parts[ 2 ], parts[ 2 ]
			].join( '' );
		}

		return '#' + normalizedHexColor + separator;
	} );
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
