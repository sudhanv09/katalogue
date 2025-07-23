import { customAlphabet } from 'nanoid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const length = 12;
const nanoid = customAlphabet(alphabet, length);

export const library = sqliteTable('library', {
	id: text('id', { length: 12 })
		.primaryKey()
		.$defaultFn(() => nanoid()),

	title: text('title'),
	author: text('author'),
	description: text('description'),
	read_status: text('status', {enum: ["read", "reading", "finished", "dropped"]}),
	progress: integer('progress'),
	dir: text('dir'),
	
})