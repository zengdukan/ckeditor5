/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import BalloonEditorBase from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import ArticlePluginSet from '@ckeditor/ckeditor5-core/tests/_utils/articlepluginset';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import HtmlComment from '@ckeditor/ckeditor5-html-support/src/htmlcomment';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import TextPartLanguage from '@ckeditor/ckeditor5-language/src/textpartlanguage';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';

class ClassicEditor extends ClassicEditorBase {}
class InlineEditor extends InlineEditorBase {}
class BalloonEditor extends BalloonEditorBase {}
class DecoupledEditor extends DecoupledEditorBase {}

for ( const Editor of [ ClassicEditor, InlineEditor, BalloonEditor, DecoupledEditor ] ) {
	// Plugins to include in the build.
	Editor.builtinPlugins = [
		ArticlePluginSet, Underline, Strikethrough, Superscript, Subscript, Code, RemoveFormat,
		FindAndReplace, FontColor, FontBackgroundColor, FontFamily, FontSize, Highlight,
		CodeBlock, TodoList, ListProperties, TableProperties, TableCellProperties, TableCaption,
		EasyImage, ImageResize, LinkImage, AutoImage, HtmlEmbed, HtmlComment,
		AutoLink, Mention, TextTransformation,
		Alignment, IndentBlock,
		PasteFromOffice, PageBreak, HorizontalLine,
		SpecialCharacters, SpecialCharactersEssentials, WordCount,
		ImageUpload, CloudServices, TextPartLanguage
	];

	// Editor configuration.
	Editor.defaultConfig = {
		toolbar: [
			'heading',
			'|',
			'removeFormat', 'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'link',
			'|',
			'highlight', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
			'|',
			'bulletedList', 'numberedList', 'todoList',
			'|',
			'blockQuote', 'uploadImage', 'insertTable', 'mediaEmbed', 'codeBlock',
			'|',
			'htmlEmbed',
			'|',
			'alignment', 'outdent', 'indent',
			'|',
			'pageBreak', 'horizontalLine', 'specialCharacters',
			'|',
			'textPartLanguage',
			'|',
			'undo', 'redo', 'findAndReplace'
		],
		table: {
			contentToolbar: [
				'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
			]
		},
		image: {
			styles: [
				'alignCenter',
				'alignLeft',
				'alignRight'
			],
			resizeOptions: [
				{
					name: 'resizeImage:original',
					label: 'Original size',
					value: null
				},
				{
					name: 'resizeImage:50',
					label: '50%',
					value: '50'
				},
				{
					name: 'resizeImage:75',
					label: '75%',
					value: '75'
				}
			],
			toolbar: [
				'imageTextAlternative', 'toggleImageCaption', '|',
				'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', 'imageStyle:side', '|',
				'resizeImage'
			],
			insert: {
				integrations: [
					'insertImageViaUrl'
				]
			}
		},
		placeholder: 'Type the content here!',
		// This value must be kept in sync with the language defined in webpack.config.js.
		language: 'en'
	};

	// Enable the `SourceEditing` plugin for ClassicEditor only.
	if ( Editor === ClassicEditor ) {
		Editor.builtinPlugins.push( SourceEditing );

		Editor.defaultConfig.toolbar.push( '|', 'sourceEditing' );
	}
}

export default {
	ClassicEditor, InlineEditor, BalloonEditor, DecoupledEditor
};
