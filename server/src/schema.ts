import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').unique(),
  isVerified: boolean('is_verified').default(false),
  verificationToken: text('verification_token'),
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  middleName: text('middle_name'),
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  nationality: text('nationality'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  alternatePhone: text('alternate_phone'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field: text('field').notNull(),
  startYear: text('start_year').notNull(),
  endYear: text('end_year'),
  certificateUrl: text('certificate_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const professional = pgTable('professional', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  organization: text('organization').notNull(),
  position: text('position').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  responsibilities: text('responsibilities'),
  professionalQualification: text('professional_qualification'),
  qualificationYear: text('qualification_year'),
  registrationNumber: text('registration_number'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const complaintStatusEnum = {
  RECEIVED: 'RECEIVED',
  INVESTIGATING: 'INVESTIGATING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
} as const;

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