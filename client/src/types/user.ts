import { User, Member } from '../../../shared/schema';

export type ExtendedUser = User & {
  member?: Member;
};

export type UserRole = 'MEMBER' | 'ADMINISTRATOR' | 'FINANCIAL_ADMINISTRATOR' | 'FINANCIAL_OFFICER' | 'FINANCIAL_AUDITOR' | 'ETHICS_OFFICER'; 