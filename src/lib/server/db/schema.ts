import { customAlphabet } from 'nanoid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

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
	read_status: text('status', { enum: ["to-read", "reading", "finished", "dropped"] }).default('to-read'),
	cover_path: text('cover_path'),
	progress: integer('progress'),
	current_chapter_id: text('current_chapter_id'),
	current_page: integer('current_page').default(0),
	dir: text('dir'),
})

export const history = sqliteTable('history', {
	id: text('id', { length: 12 })
		.primaryKey()
		.$defaultFn(() => nanoid()),
	read_on: text('read').default(sql`(CURRENT_TIMESTAMP)`),
	library_id: text('library_id', { length: 12 }).notNull().references(() => library.id),
})

export const libraryRelations = relations(library, ({ many }) => ({
	history: many(history),
}));

export const historyRelations = relations(history, ({ one }) => ({
	book: one(library, {
		fields: [history.library_id],
		references: [library.id],
	}),
}));


