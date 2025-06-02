import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FinancialDashboard from '../pages/financial-dashboard';
import { api } from '../utils/api';

// Mock the API
jest.mock('../utils/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

// Mock the auth context
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', role: 'admin' },
  }),
}));

describe('FinancialDashboard', () => {
  const mockFinancialData = {
    balanceSheet: [
      { account: 'Cash', debit: 1000, credit: 0 },
      { account: 'Accounts Receivable', debit: 500, credit: 0 },
    ],
    incomeStatement: [
      { date: '2024-01', revenue: 10000, expenses: 8000, netIncome: 2000 },
      { date: '2024-02', revenue: 12000, expenses: 9000, netIncome: 3000 },
    ],
    cashFlow: {
      operating: 5000,
      investing: -2000,
      financing: 1000,
      netCashFlow: 4000,
    },
    ratios: {
      currentRatio: 2.5,
      debtToEquityRatio: 0.8,
      returnOnEquity: 0.15,
      grossProfitMargin: 0.3,
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock API responses
    (api.get as jest.Mock).mockImplementation((endpoint) => {
      switch (endpoint) {
        case '/financial/reports/balance-sheet':
          return Promise.resolve({ data: mockFinancialData.balanceSheet });
        case '/financial/reports/income-statement':
          return Promise.resolve({ data: mockFinancialData.incomeStatement });
        case '/financial/reports/cash-flow':
          return Promise.resolve({ data: mockFinancialData.cashFlow });
        case '/financial/reports/ratios':
          return Promise.resolve({ data: mockFinancialData.ratios });
        default:
          return Promise.reject(new Error('Not found'));
      }
    });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <FinancialDashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders financial dashboard with data', async () => {
    render(
      <MemoryRouter>
        <FinancialDashboard />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
    });

    // Check if all tabs are rendered
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Balance Sheet')).toBeInTheDocument();
    expect(screen.getByText('Income Statement')).toBeInTheDocument();
    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Ratios')).toBeInTheDocument();

    // Check if financial ratios are displayed
    expect(screen.getByText('currentRatio')).toBeInTheDocument();
    expect(screen.getByText('2.50')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <FinancialDashboard />
      </MemoryRouter>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch financial data')).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', async () => {
    render(
      <MemoryRouter>
        <FinancialDashboard />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
    });

    // Click on Balance Sheet tab
    screen.getByText('Balance Sheet').click();
    expect(screen.getByText('Balance Sheet')).toBeInTheDocument();

    // Click on Income Statement tab
    screen.getByText('Income Statement').click();
    expect(screen.getByText('Income Statement')).toBeInTheDocument();

    // Click on Cash Flow tab
    screen.getByText('Cash Flow').click();
    expect(screen.getByText('Cash Flow Statement')).toBeInTheDocument();

    // Click on Ratios tab
    screen.getByText('Ratios').click();
    expect(screen.getByText('Financial Ratios')).toBeInTheDocument();
  });
}); 