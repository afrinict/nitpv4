import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { financialService } from '../services/financialService';
import { logger } from '../utils/logger';
import { rateLimiter } from '../middleware/rateLimiter';
import { suspiciousActivityCheck } from '../middleware/suspiciousActivityCheck';
import { authenticate } from '../middleware/auth';
const router = Router();
// Apply middleware to all routes
router.use(authenticate);
router.use(rateLimiter);
router.use(suspiciousActivityCheck);
// Validation middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
// Chart of Accounts
router.post('/accounts', [
    body('code').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('type').isIn(['asset', 'liability', 'equity', 'revenue', 'expense']),
    body('category').isString().notEmpty(),
], validateRequest, async (req, res) => {
    try {
        const account = await financialService.createAccount(req.body);
        res.status(201).json(account);
    }
    catch (error) {
        logger.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});
router.get('/accounts', async (req, res) => {
    try {
        const accounts = await financialService.getAccounts(req.query);
        res.json(accounts);
    }
    catch (error) {
        logger.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});
// Journal Entries
router.post('/journal-entries', [
    body('date').isISO8601(),
    body('description').isString().notEmpty(),
    body('lines').isArray().notEmpty(),
    body('lines.*.account').isMongoId(),
    body('lines.*.debit').isNumeric(),
    body('lines.*.credit').isNumeric(),
], validateRequest, async (req, res) => {
    try {
        const entry = await financialService.createJournalEntry({
            ...req.body,
            createdBy: req.user.id,
        });
        res.status(201).json(entry);
    }
    catch (error) {
        logger.error('Error creating journal entry:', error);
        res.status(500).json({ error: 'Failed to create journal entry' });
    }
});
router.post('/journal-entries/:id/post', async (req, res) => {
    try {
        const entry = await financialService.postJournalEntry(req.params.id, req.user.id);
        res.json(entry);
    }
    catch (error) {
        logger.error('Error posting journal entry:', error);
        res.status(500).json({ error: 'Failed to post journal entry' });
    }
});
// Budget Management
router.post('/budgets', [
    body('fiscalYear').isString().notEmpty(),
    body('department').isString().notEmpty(),
    body('account').isMongoId(),
    body('amount').isNumeric(),
], validateRequest, async (req, res) => {
    try {
        const budget = await financialService.createBudget({
            ...req.body,
            createdBy: req.user.id,
        });
        res.status(201).json(budget);
    }
    catch (error) {
        logger.error('Error creating budget:', error);
        res.status(500).json({ error: 'Failed to create budget' });
    }
});
router.post('/budgets/:id/approve', async (req, res) => {
    try {
        const budget = await financialService.approveBudget(req.params.id, req.user.id);
        res.json(budget);
    }
    catch (error) {
        logger.error('Error approving budget:', error);
        res.status(500).json({ error: 'Failed to approve budget' });
    }
});
// Expense Management
router.post('/expenses', [
    body('date').isISO8601(),
    body('description').isString().notEmpty(),
    body('amount').isNumeric(),
    body('account').isMongoId(),
], validateRequest, async (req, res) => {
    try {
        const expense = await financialService.createExpense({
            ...req.body,
            submittedBy: req.user.id,
        });
        res.status(201).json(expense);
    }
    catch (error) {
        logger.error('Error creating expense:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});
router.post('/expenses/:id/approve', async (req, res) => {
    try {
        const expense = await financialService.approveExpense(req.params.id, req.user.id);
        res.json(expense);
    }
    catch (error) {
        logger.error('Error approving expense:', error);
        res.status(500).json({ error: 'Failed to approve expense' });
    }
});
// Bank Reconciliation
router.post('/bank-accounts/:id/reconcile', [
    body('transactions').isArray().notEmpty(),
    body('transactions.*.date').isISO8601(),
    body('transactions.*.description').isString().notEmpty(),
    body('transactions.*.amount').isNumeric(),
], validateRequest, async (req, res) => {
    try {
        const account = await financialService.reconcileBankAccount(req.params.id, req.body.transactions);
        res.json(account);
    }
    catch (error) {
        logger.error('Error reconciling bank account:', error);
        res.status(500).json({ error: 'Failed to reconcile bank account' });
    }
});
// Financial Reports
router.get('/reports/balance-sheet', async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const balanceSheet = await financialService.generateBalanceSheet(date);
        res.json(balanceSheet);
    }
    catch (error) {
        logger.error('Error generating balance sheet:', error);
        res.status(500).json({ error: 'Failed to generate balance sheet' });
    }
});
router.get('/reports/income-statement', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const incomeStatement = await financialService.generateIncomeStatement(new Date(startDate), new Date(endDate));
        res.json(incomeStatement);
    }
    catch (error) {
        logger.error('Error generating income statement:', error);
        res.status(500).json({ error: 'Failed to generate income statement' });
    }
});
export default router;
