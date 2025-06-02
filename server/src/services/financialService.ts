import { Account, JournalEntry, Budget, Expense, BankAccount, BankTransaction } from '../models/FinancialModels';
import { logger } from '../utils/logger';
import { monitoringService } from '../utils/monitoring';

class FinancialService {
  private static instance: FinancialService;

  private constructor() {}

  public static getInstance(): FinancialService {
    if (!FinancialService.instance) {
      FinancialService.instance = new FinancialService();
    }
    return FinancialService.instance;
  }

  // Chart of Accounts
  async createAccount(accountData: any): Promise<any> {
    try {
      const account = new Account(accountData);
      await account.save();
      return account;
    } catch (error) {
      logger.error('Error creating account:', error);
      throw error;
    }
  }

  async getAccounts(query: any = {}): Promise<any[]> {
    try {
      return await Account.find(query).populate('parentAccount');
    } catch (error) {
      logger.error('Error fetching accounts:', error);
      throw error;
    }
  }

  // Journal Entries
  async createJournalEntry(entryData: any): Promise<any> {
    try {
      // Validate debit/credit balance
      const totalDebit = entryData.lines.reduce((sum: number, line: any) => sum + line.debit, 0);
      const totalCredit = entryData.lines.reduce((sum: number, line: any) => sum + line.credit, 0);

      if (totalDebit !== totalCredit) {
        throw new Error('Debit and credit amounts must be equal');
      }

      const entry = new JournalEntry(entryData);
      await entry.save();

      // Log the transaction
      await monitoringService.trackFinancialTransaction('journal_entry', {
        entryNumber: entry.entryNumber,
        amount: totalDebit,
        createdBy: entryData.createdBy,
      });

      return entry;
    } catch (error) {
      logger.error('Error creating journal entry:', error);
      throw error;
    }
  }

  async postJournalEntry(entryId: string, approvedBy: string): Promise<any> {
    try {
      const entry = await JournalEntry.findById(entryId);
      if (!entry) {
        throw new Error('Journal entry not found');
      }

      if (entry.status !== 'draft') {
        throw new Error('Only draft entries can be posted');
      }

      entry.status = 'posted';
      entry.approvedBy = approvedBy;
      await entry.save();

      // Log the approval
      await monitoringService.trackFinancialTransaction('journal_entry_approval', {
        entryNumber: entry.entryNumber,
        approvedBy,
      });

      return entry;
    } catch (error) {
      logger.error('Error posting journal entry:', error);
      throw error;
    }
  }

  // Budget Management
  async createBudget(budgetData: any): Promise<any> {
    try {
      const budget = new Budget(budgetData);
      await budget.save();
      return budget;
    } catch (error) {
      logger.error('Error creating budget:', error);
      throw error;
    }
  }

  async approveBudget(budgetId: string, approvedBy: string): Promise<any> {
    try {
      const budget = await Budget.findById(budgetId);
      if (!budget) {
        throw new Error('Budget not found');
      }

      budget.status = 'approved';
      budget.approvedBy = approvedBy;
      await budget.save();

      // Log the approval
      await monitoringService.trackFinancialTransaction('budget_approval', {
        budgetId,
        approvedBy,
      });

      return budget;
    } catch (error) {
      logger.error('Error approving budget:', error);
      throw error;
    }
  }

  // Expense Management
  async createExpense(expenseData: any): Promise<any> {
    try {
      const expense = new Expense(expenseData);
      await expense.save();

      // Log the expense creation
      await monitoringService.trackFinancialTransaction('expense_creation', {
        expenseNumber: expense.expenseNumber,
        amount: expense.amount,
        submittedBy: expenseData.submittedBy,
      });

      return expense;
    } catch (error) {
      logger.error('Error creating expense:', error);
      throw error;
    }
  }

  async approveExpense(expenseId: string, approvedBy: string): Promise<any> {
    try {
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      expense.status = 'approved';
      expense.approvedBy = approvedBy;
      await expense.save();

      // Log the approval
      await monitoringService.trackFinancialTransaction('expense_approval', {
        expenseNumber: expense.expenseNumber,
        amount: expense.amount,
        approvedBy,
      });

      return expense;
    } catch (error) {
      logger.error('Error approving expense:', error);
      throw error;
    }
  }

  // Bank Reconciliation
  async reconcileBankAccount(accountId: string, transactions: any[]): Promise<any> {
    try {
      const account = await BankAccount.findById(accountId);
      if (!account) {
        throw new Error('Bank account not found');
      }

      // Process each transaction
      for (const transaction of transactions) {
        const bankTransaction = new BankTransaction({
          ...transaction,
          bankAccount: accountId,
          status: 'reconciled',
        });
        await bankTransaction.save();

        // Create corresponding journal entry if needed
        if (transaction.createJournalEntry) {
          await this.createJournalEntry({
            date: transaction.date,
            description: `Bank reconciliation: ${transaction.description}`,
            lines: transaction.journalLines,
            status: 'posted',
            createdBy: transaction.reconciledBy,
          });
        }
      }

      account.lastReconciled = new Date();
      await account.save();

      // Log the reconciliation
      await monitoringService.trackFinancialTransaction('bank_reconciliation', {
        accountId,
        transactionCount: transactions.length,
      });

      return account;
    } catch (error) {
      logger.error('Error reconciling bank account:', error);
      throw error;
    }
  }

  // Financial Reports
  async generateBalanceSheet(date: Date): Promise<any> {
    try {
      const accounts = await Account.find({ isActive: true });
      const balances: any = {};

      // Calculate balances for each account
      for (const account of accounts) {
        const debitTotal = await JournalEntry.aggregate([
          { $match: { 'lines.account': account._id, date: { $lte: date } } },
          { $unwind: '$lines' },
          { $match: { 'lines.account': account._id } },
          { $group: { _id: null, total: { $sum: '$lines.debit' } } },
        ]);

        const creditTotal = await JournalEntry.aggregate([
          { $match: { 'lines.account': account._id, date: { $lte: date } } },
          { $unwind: '$lines' },
          { $match: { 'lines.account': account._id } },
          { $group: { _id: null, total: { $sum: '$lines.credit' } } },
        ]);

        balances[account._id] = {
          account,
          balance: (debitTotal[0]?.total || 0) - (creditTotal[0]?.total || 0),
        };
      }

      return balances;
    } catch (error) {
      logger.error('Error generating balance sheet:', error);
      throw error;
    }
  }

  async generateIncomeStatement(startDate: Date, endDate: Date): Promise<any> {
    try {
      const revenueAccounts = await Account.find({ type: 'revenue', isActive: true });
      const expenseAccounts = await Account.find({ type: 'expense', isActive: true });

      const revenue = await this.calculateAccountBalances(revenueAccounts, startDate, endDate);
      const expenses = await this.calculateAccountBalances(expenseAccounts, startDate, endDate);

      return {
        revenue,
        expenses,
        netIncome: revenue.total - expenses.total,
      };
    } catch (error) {
      logger.error('Error generating income statement:', error);
      throw error;
    }
  }

  private async calculateAccountBalances(accounts: any[], startDate: Date, endDate: Date): Promise<any> {
    const balances: any = {};
    let total = 0;

    for (const account of accounts) {
      const debitTotal = await JournalEntry.aggregate([
        { $match: { 'lines.account': account._id, date: { $gte: startDate, $lte: endDate } } },
        { $unwind: '$lines' },
        { $match: { 'lines.account': account._id } },
        { $group: { _id: null, total: { $sum: '$lines.debit' } } },
      ]);

      const creditTotal = await JournalEntry.aggregate([
        { $match: { 'lines.account': account._id, date: { $gte: startDate, $lte: endDate } } },
        { $unwind: '$lines' },
        { $match: { 'lines.account': account._id } },
        { $group: { _id: null, total: { $sum: '$lines.credit' } } },
      ]);

      const balance = (debitTotal[0]?.total || 0) - (creditTotal[0]?.total || 0);
      balances[account._id] = {
        account,
        balance,
      };
      total += balance;
    }

    return { balances, total };
  }

  // Tax Management
  async calculateTaxLiability(fiscalYear: number): Promise<any> {
    try {
      const revenueAccounts = await Account.find({ type: 'revenue', isActive: true });
      const expenseAccounts = await Account.find({ type: 'expense', isActive: true });

      const startDate = new Date(fiscalYear, 0, 1);
      const endDate = new Date(fiscalYear, 11, 31);

      const revenue = await this.calculateAccountBalances(revenueAccounts, startDate, endDate);
      const expenses = await this.calculateAccountBalances(expenseAccounts, startDate, endDate);

      const taxableIncome = revenue.total - expenses.total;
      const taxRate = 0.21; // 21% corporate tax rate
      const taxLiability = taxableIncome * taxRate;

      return {
        fiscalYear,
        taxableIncome,
        taxRate,
        taxLiability,
        revenue,
        expenses,
      };
    } catch (error) {
      logger.error('Error calculating tax liability:', error);
      throw error;
    }
  }

  // Cash Flow Analysis
  async generateCashFlowStatement(startDate: Date, endDate: Date): Promise<any> {
    try {
      const cashAccounts = await Account.find({ type: 'asset', category: 'cash', isActive: true });
      
      const operatingActivities = await this.calculateCashFlowByType('operating', startDate, endDate);
      const investingActivities = await this.calculateCashFlowByType('investing', startDate, endDate);
      const financingActivities = await this.calculateCashFlowByType('financing', startDate, endDate);

      const netCashFlow = operatingActivities + investingActivities + financingActivities;

      return {
        period: { startDate, endDate },
        operatingActivities,
        investingActivities,
        financingActivities,
        netCashFlow,
        cashAccounts: await this.calculateAccountBalances(cashAccounts, startDate, endDate),
      };
    } catch (error) {
      logger.error('Error generating cash flow statement:', error);
      throw error;
    }
  }

  private async calculateCashFlowByType(type: string, startDate: Date, endDate: Date): Promise<number> {
    const accounts = await Account.find({ 
      type: 'asset',
      category: type === 'operating' ? 'cash' : type,
      isActive: true 
    });

    const balances = await this.calculateAccountBalances(accounts, startDate, endDate);
    return balances.total;
  }

  // Financial Ratios
  async calculateFinancialRatios(date: Date): Promise<any> {
    try {
      const balanceSheet = await this.generateBalanceSheet(date);
      
      // Calculate key ratios
      const currentRatio = await this.calculateCurrentRatio(balanceSheet);
      const debtToEquityRatio = await this.calculateDebtToEquityRatio(balanceSheet);
      const returnOnEquity = await this.calculateReturnOnEquity(balanceSheet, date);
      const grossProfitMargin = await this.calculateGrossProfitMargin(date);

      return {
        date,
        currentRatio,
        debtToEquityRatio,
        returnOnEquity,
        grossProfitMargin,
      };
    } catch (error) {
      logger.error('Error calculating financial ratios:', error);
      throw error;
    }
  }

  private async calculateCurrentRatio(balanceSheet: any): Promise<number> {
    const currentAssets = Object.values(balanceSheet)
      .filter((account: any) => account.account.type === 'asset' && account.account.category === 'current')
      .reduce((sum: number, account: any) => sum + account.balance, 0);

    const currentLiabilities = Object.values(balanceSheet)
      .filter((account: any) => account.account.type === 'liability' && account.account.category === 'current')
      .reduce((sum: number, account: any) => sum + account.balance, 0);

    return currentLiabilities === 0 ? 0 : currentAssets / currentLiabilities;
  }

  private async calculateDebtToEquityRatio(balanceSheet: any): Promise<number> {
    const totalLiabilities = Object.values(balanceSheet)
      .filter((account: any) => account.account.type === 'liability')
      .reduce((sum: number, account: any) => sum + account.balance, 0);

    const totalEquity = Object.values(balanceSheet)
      .filter((account: any) => account.account.type === 'equity')
      .reduce((sum: number, account: any) => sum + account.balance, 0);

    return totalEquity === 0 ? 0 : totalLiabilities / totalEquity;
  }

  private async calculateReturnOnEquity(balanceSheet: any, date: Date): Promise<number> {
    const netIncome = await this.calculateNetIncome(date);
    const totalEquity = Object.values(balanceSheet)
      .filter((account: any) => account.account.type === 'equity')
      .reduce((sum: number, account: any) => sum + account.balance, 0);

    return totalEquity === 0 ? 0 : netIncome / totalEquity;
  }

  private async calculateGrossProfitMargin(date: Date): Promise<number> {
    const revenue = await this.calculateTotalRevenue(date);
    const costOfGoodsSold = await this.calculateCostOfGoodsSold(date);

    return revenue === 0 ? 0 : (revenue - costOfGoodsSold) / revenue;
  }

  private async calculateNetIncome(date: Date): Promise<number> {
    const revenueAccounts = await Account.find({ type: 'revenue', isActive: true });
    const expenseAccounts = await Account.find({ type: 'expense', isActive: true });

    const startDate = new Date(date.getFullYear(), 0, 1);
    const revenue = await this.calculateAccountBalances(revenueAccounts, startDate, date);
    const expenses = await this.calculateAccountBalances(expenseAccounts, startDate, date);

    return revenue.total - expenses.total;
  }

  private async calculateTotalRevenue(date: Date): Promise<number> {
    const revenueAccounts = await Account.find({ type: 'revenue', isActive: true });
    const startDate = new Date(date.getFullYear(), 0, 1);
    const revenue = await this.calculateAccountBalances(revenueAccounts, startDate, date);
    return revenue.total;
  }

  private async calculateCostOfGoodsSold(date: Date): Promise<number> {
    const cogsAccounts = await Account.find({ type: 'expense', category: 'cost_of_goods_sold', isActive: true });
    const startDate = new Date(date.getFullYear(), 0, 1);
    const cogs = await this.calculateAccountBalances(cogsAccounts, startDate, date);
    return cogs.total;
  }

  // Budget Variance Analysis
  async analyzeBudgetVariance(fiscalYear: number, period: 'monthly' | 'quarterly' | 'annually'): Promise<any> {
    try {
      const budgets = await Budget.find({ fiscalYear, period });
      const varianceAnalysis: any = {};

      for (const budget of budgets) {
        const startDate = new Date(fiscalYear, 0, 1);
        const endDate = new Date(fiscalYear, 11, 31);

        const actualExpenses = await this.calculateAccountBalances([budget.account], startDate, endDate);
        const variance = actualExpenses.total - budget.amount;
        const variancePercentage = (variance / budget.amount) * 100;

        varianceAnalysis[budget._id] = {
          budget,
          actual: actualExpenses.total,
          variance,
          variancePercentage,
          status: Math.abs(variancePercentage) <= 5 ? 'on_track' : variancePercentage > 5 ? 'over_budget' : 'under_budget',
        };
      }

      return varianceAnalysis;
    } catch (error) {
      logger.error('Error analyzing budget variance:', error);
      throw error;
    }
  }
}

export const financialService = FinancialService.getInstance(); 