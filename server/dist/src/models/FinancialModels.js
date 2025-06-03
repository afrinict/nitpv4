import { Schema, model } from 'mongoose';
const AccountSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['asset', 'liability', 'equity', 'revenue', 'expense'] },
    category: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
    parentAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
}, { timestamps: true });
const JournalEntrySchema = new Schema({
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
const BudgetSchema = new Schema({
    fiscalYear: { type: Number, required: true },
    department: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true },
    period: { type: String, required: true, enum: ['monthly', 'quarterly', 'annually'] },
    status: { type: String, required: true, enum: ['draft', 'approved', 'active', 'closed'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
const ExpenseSchema = new Schema({
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
const BankAccountSchema = new Schema({
    accountNumber: { type: String, required: true, unique: true },
    bankName: { type: String, required: true },
    accountType: { type: String, required: true },
    currency: { type: String, required: true },
    openingBalance: { type: Number, required: true },
    currentBalance: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    lastReconciled: Date,
}, { timestamps: true });
const BankTransactionSchema = new Schema({
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
export const Account = model('Account', AccountSchema);
export const JournalEntry = model('JournalEntry', JournalEntrySchema);
export const Budget = model('Budget', BudgetSchema);
export const Expense = model('Expense', ExpenseSchema);
export const BankAccount = model('BankAccount', BankAccountSchema);
export const BankTransaction = model('BankTransaction', BankTransactionSchema);
