import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Define your schema here or import it from a separate file
// Example schema:
/*
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').defaultNow()
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id').references(() => users.id),
  first_name: text('first_name'),
  last_name: text('last_name'),
  phone: text('phone'),
  created_at: timestamp('created_at').defaultNow()
});
*/