/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals DOMParser */

import { filterStyles, inlineStyles, normalizeStyles } from '../src/styles';

describe( 'PasteFromOffice - styles', () => {
	describe( 'styles', () => {
		const domParser = new DOMParser();

		describe( 'inlineStyles', () => {
			const testData = [
				{
					name: 'should not override styles specified in `style` attribute',
					sheets: [ 'p { color: red; margin-left: 1px; }' ],
					body: '<p>Foo</p><p style="color:blue">Bar</p>',
					expected: '<p style="color:red; margin-left:1px">Foo</p><p style="color:blue; margin-left:1px">Bar</p>'
				},
				{
					name: 'should inline styles in the order of priority',
					sheets: [
						'p { color: red } p { color: black } p { background-color: blue }',
						'.class1 { background-color: yellow }'
					],
					body: '<p>Foo</p><p class="class1">Bar</p>',
					expected: '<p style="background-color:blue; color:red">Foo</p>' +
						'<p class="class1" style="background-color:yellow; color:red">Bar</p>'
				},
				{
					name: 'should filter styles skipped by the linter',
					sheets: [
						'p {' +
							'break-before:auto;' +
							'break-after:auto;' +
							'break-inside:auto;' +
							'page-break:auto;' +
							'page-break-before:auto;' +
							'page-break-after:auto;' +
							'page-break-inside:auto;' +
							'color:red' +
						'}'
					],
					body: '<p>Foo</p>',
					expected: '<p style="color:red">Foo</p>'
				},
				{
					name: 'should remove extra spaces from `font-family`',
					sheets: [ 'p { font-family: Arial    ,  Helvetica, sans-serif }' ],
					body: '<p>Foo</p>',
					expected: '<p style="font-family:Arial,Helvetica,sans-serif">Foo</p>'
				},
				{
					name: 'should convert rgb color to hex',
					sheets: [ 'p { color:rgb(123,244,1) }' ],
					body: '<p>Foo</p>',
					expected: '<p style="color:#7bf401">Foo</p>'
				},
				{
					name: 'should expand `margin` style',
					sheets: [
						'.a { margin: auto }',
						'.b { margin: 1px 20% }',
						'.c { margin: 1 2 3 }',
						'.d { margin: 1 2 3 4 }'
					],
					body: '<p class="a">A</p><p class="b">B</p><p class="c">C</p><p class="d">D</p>',
					expected: '<p class="a" style="margin-bottom:auto; margin-left:auto; margin-right:auto; margin-top:auto">A</p>' +
						'<p class="b" style="margin-bottom:1px; margin-left:20%; margin-right:20%; margin-top:1px">B</p>' +
						'<p class="c" style="margin-bottom:3px; margin-left:2px; margin-right:2px; margin-top:1px">C</p>' +
						'<p class="d" style="margin-bottom:3px; margin-left:4px; margin-right:2px; margin-top:1px">D</p>'
				}
			];

			for ( const test of testData ) {
				it( test.name, () => {
					const document = domParser.parseFromString(
						'<html>' +
							'<head>' +
								test.sheets.map( s => `<style>${ s }</style>` ).join( '' ) +
							'</head>' +
							'<body>' +
								test.body +
							'</body>' +
						'</html>',
						'text/html'
					);
					const sheets = getSheets( document );

					inlineStyles( sheets, document );

					expect( document.body.innerHTML ).to.equal( test.expected );
				} );
			}

			function getSheets( document ) {
				return Array.from( document.getElementsByTagName( 'style' ) ).map( s => s.sheet );
			}
		} );

		describe( 'filterStyles', () => {
			it( 'should remove superfluous tyles', () => {
				const document = domParser.parseFromString(
					'<html>' +
						'<head></head>' +
						'<body>' +
							'<div style="background-color:transparent">Foo</div>' +
							'<div style="background:transparent">Foo</div>' +
							'<div style="background-color:none">Foo</div>' +
							'<div style="background:none">Foo</div>' +
							'<div style="background-position:initial initial">Foo</div>' +
							'<div style="background-repeat:initial initial; margin-left:2px">Foo</div>' +
							'<div class="test" style="caret-color:red">Foo</div>' +
							'<div style="font-family:-webkit-standard">Foo</div>' +
							'<div style="font-variant-caps">Foo</div>' +
							'<div style="letter-spacing:normal">Foo</div>' +
							'<div class="test" style="font-color:red">Foo</div>' +
							'<div style="orphans:revert">Foo</div>' +
							'<div style="widows:inherit">Foo</div>' +
							'<div style="text-transform:none">Foo</div>' +
							'<div style="word-spacing:0px">Foo</div>' +
							'<div style="-webkit-text-size-adjust:auto">Foo</div>' +
							'<div style="-webkit-text-stroke-width:0px">Foo</div>' +
							'<div style="text-indent:0px">Foo</div>' +
							'<div style="margin-bottom:0i">Foo</div>' +
						'</body>' +
					'</html>',
					'text/html'
				);

				filterStyles( document );

				expect( document.documentElement.outerHTML ).to.equal(
					'<html>' +
						'<head></head>' +
						'<body>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div style="margin-left:2px">Foo</div>' +
							'<div class="test">Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div class="test" style="font-color:red">Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
							'<div>Foo</div>' +
						'</body>' +
					'</html>'
				);
			} );

			it( 'should normalizeStyles', () => {
				const document = domParser.parseFromString(
					'<html>' +
						'<head></head>' +
						'<body>' +
							'<div style="margin: 25 50 0 100">Foo</div>' +
						'</body>' +
					'</html>',
					'text/html'
				);

				filterStyles( document );

				expect( document.documentElement.outerHTML ).to.equal(
					'<html>' +
						'<head></head>' +
						'<body>' +
							'<div style="margin-left:100; margin-right:50; margin-top:25">Foo</div>' +
						'</body>' +
					'</html>'
				);
			} );
		} );

		describe( 'normalizeStyles', () => {
			const testStyles = [
				{ style: 'background-color:transparent', elements: [ 'p', 'div' ] },
				{ style: 'border-image:none', elements: [ 'p', 'div' ] },
				{ style: 'color:windowtext', elements: [ 'p', 'div' ] },
				{ style: 'direction:ltr', elements: [ 'p', 'div' ] },
				{ style: 'mso-test1', elements: [ 'p', 'div' ] },
				{ style: 'mso-test2', elements: [ 'p', 'div' ] },
				{ style: 'visibility:visible', elements: [ 'p', 'div' ] },
				{ style: 'border:none', elements: [ 'div' ] },
				{ style: 'color:red', elements: [] }
			];

			for ( const style of testStyles ) {
				for ( const elementName of [ 'p', 'div' ] ) {
					if ( style.elements.includes( elementName ) ) {
						it( `should remove ${ style.style } style from ${ elementName }`, () => {
							const element = createElement( elementName, `font-size:300%;${ style.style }` );

							normalizeStyles( element );

							sinon.assert.calledOnceWithExactly( element.setAttribute, 'style', 'font-size:300%' );
							sinon.assert.notCalled( element.removeAttribute );
						} );
					} else {
						it( `should not remove ${ style.style } style from ${ elementName }`, () => {
							const element = createElement( elementName, `font-size:300%;${ style.style }` );

							normalizeStyles( element );

							sinon.assert.calledOnceWithExactly( element.setAttribute, 'style', `${ style.style }; font-size:300%` );
							sinon.assert.notCalled( element.removeAttribute );
						} );
					}
				}
			}

			it( 'shoud remove `style` attribute when all styles are removed', () => {
				const element = createElement( 'div', 'direction:ltr; visibility:visible' );

				normalizeStyles( element );

				sinon.assert.notCalled( element.setAttribute );
				sinon.assert.calledOnceWithExactly( element.removeAttribute, 'style' );
			} );

			it( 'should remove margins', () => {
				const element = createElement( 'div', 'margin-left:0; margin-right:14; margin-bottom:0' );

				normalizeStyles( element );

				sinon.assert.calledOnceWithExactly( element.setAttribute, 'style', 'margin-right:14' );
				sinon.assert.notCalled( element.removeAttribute );
			} );

			it( 'should `margin` style with `margin-*` styles', () => {
				const element = createElement( 'div', 'margin:1 2 3 4' );

				normalizeStyles( element );

				sinon.assert.calledOnceWithExactly(
					element.setAttribute,
					'style',
					'margin-bottom:3; margin-left:4; margin-right:2; margin-top:1'
				);
				sinon.assert.notCalled( element.removeAttribute );
			} );

			function createElement( elementName, styles ) {
				const getAttribute = sinon.stub();

				getAttribute.withArgs( 'style' ).returns( styles );

				return {
					name: elementName,
					getAttribute,
					setAttribute: sinon.spy(),
					removeAttribute: sinon.spy()
				};
			}
		} );
	} );
} );
