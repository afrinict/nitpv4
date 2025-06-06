import { User as SchemaUser, Member } from '../../../shared/schema';

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
  ETHICS_OFFICER = 'ETHICS_OFFICER',
  FINANCIAL_OFFICER = 'FINANCIAL_OFFICER',
  FINANCIAL_ADMINISTRATOR = 'FINANCIAL_ADMINISTRATOR'
}

export interface User extends SchemaUser {
  member?: Member;
  phone?: string;
  phoneNumber?: string;
}

export interface ExtendedUser extends User {
  member?: Member;
  phone?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
} 