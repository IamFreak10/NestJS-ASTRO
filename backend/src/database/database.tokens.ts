import type { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schema/index.js';

export const DRIZZLE_DB = Symbol('DRIZZLE_DB');
export const MYSQL_POOL = Symbol('MYSQL_POOL');

export type DrizzleDb = MySql2Database<typeof schema>;

