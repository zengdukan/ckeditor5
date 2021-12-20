/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

export type DiffResult = 'equal' | 'insert' | 'delete';

export interface InsertChange<T> {
	type: 'insert',
	index: number,
	values: T[]
}

export interface DeleteChange {
	type: 'delete',
	index: number,
	howMany: number
}

export type Change<T> = InsertChange<T> | DeleteChange;
