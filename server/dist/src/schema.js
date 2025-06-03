import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});
export const complaintStatusEnum = {
    RECEIVED: 'RECEIVED',
    INVESTIGATING: 'INVESTIGATING',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED'
};
export const complaints = pgTable('complaints', {
    id: serial('id').primaryKey(),
    subject: text('subject').notNull(),
    details: text('details').notNull(),
    complainantName: text('complainant_name').notNull(),
    complainantEmail: text('complainant_email').notNull(),
    status: text('status').notNull().default(complaintStatusEnum.RECEIVED),
    assignedTo: integer('assigned_to').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});
