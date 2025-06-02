import { Schema, model, Document } from 'mongoose';

// Chart of Accounts
interface IAccount extends Document {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  description?: string;
  isActive: boolean;
  parentAccount?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['asset', 'liability', 'equity', 'revenue', 'expense'] },
  category: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  parentAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
}, { timestamps: true });

// Journal Entries
interface IJournalEntry extends Document {
  entryNumber: string;
  date: Date;
  description: string;
  status: 'draft' | 'posted' | 'void';
  createdBy: Schema.Types.ObjectId;
  approvedBy?: Schema.Types.ObjectId;
  lines: {
    account: Schema.Types.ObjectId;
    debit: number;
    credit: number;
    description?: string;
  }[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  entryNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: ['draft', 'posted', 'void'] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lines: [{
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    description: String,
  }],
  attachments: [String],
}, { timestamps: true });

// Budget
interface IBudget extends Document {
  fiscalYear: number;
  department: string;
  account: Schema.Types.ObjectId;
  amount: number;
  period: 'monthly' | 'quarterly' | 'annually';
  status: 'draft' | 'approved' | 'active' | 'closed';
  createdBy: Schema.Types.ObjectId;
  approvedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  fiscalYear: { type: Number, required: true },
  department: { type: String, required: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  period: { type: String, required: true, enum: ['monthly', 'quarterly', 'annually'] },
  status: { type: String, required: true, enum: ['draft', 'approved', 'active', 'closed'] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Expense
interface IExpense extends Document {
  expenseNumber: string;
  date: Date;
  description: string;
  amount: number;
  account: Schema.Types.ObjectId;
  vendor?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedBy: Schema.Types.ObjectId;
  approvedBy?: Schema.Types.ObjectId;
  paymentDetails?: {
    method: string;
    reference: string;
    date: Date;
  };
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  expenseNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  vendor: String,
  status: { type: String, required: true, enum: ['draft', 'submitted', 'approved', 'rejected', 'paid'] },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  paymentDetails: {
    method: String,
    reference: String,
    date: Date,
  },
  attachments: [String],
}, { timestamps: true });

// Bank Account
interface IBankAccount extends Document {
  accountNumber: string;
  bankName: string;
  accountType: string;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  lastReconciled: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BankAccountSchema = new Schema<IBankAccount>({
  accountNumber: { type: String, required: true, unique: true },
  bankName: { type: String, required: true },
  accountType: { type: String, required: true },
  currency: { type: String, required: true },
  openingBalance: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  lastReconciled: Date,
}, { timestamps: true });

// Bank Transaction
interface IBankTransaction extends Document {
  bankAccount: Schema.Types.ObjectId;
  date: Date;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'cleared' | 'reconciled';
  reference: string;
  journalEntry?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BankTransactionSchema = new Schema<IBankTransaction>({
  bankAccount: { type: Schema.Types.ObjectId, ref: 'BankAccount', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ['deposit', 'withdrawal', 'transfer'] },
  status: { type: String, required: true, enum: ['pending', 'cleared', 'reconciled'] },
  reference: { type: String, required: true },
  journalEntry: { type: Schema.Types.ObjectId, ref: 'JournalEntry' },
}, { timestamps: true });

// Export models
export const Account = model<IAccount>('Account', AccountSchema);
export const JournalEntry = model<IJournalEntry>('JournalEntry', JournalEntrySchema);
export const Budget = model<IBudget>('Budget', BudgetSchema);
export const Expense = model<IExpense>('Expense', ExpenseSchema);
export const BankAccount = model<IBankAccount>('BankAccount', BankAccountSchema);
export const BankTransaction = model<IBankTransaction>('BankTransaction', BankTransactionSchema); 