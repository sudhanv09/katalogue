import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const db_url = env.DATABASE_URL
if (!db_url) throw new Error('DATABASE_URL is not set');

export const db = drizzle({ schema, connection: { url: db_url } });
