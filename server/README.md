# Financial Management System

A comprehensive financial management system built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Chart of Accounts management
- Journal Entries with double-entry bookkeeping
- Budget management and tracking
- Expense management with approval workflows
- Bank reconciliation
- Financial reporting (Balance Sheet, Income Statement)
- Security features:
  - Authentication and authorization
  - Rate limiting
  - Suspicious activity detection
  - Transaction monitoring
  - Audit logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd financial-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/financial-management
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
LOG_LEVEL=info
```

## Development

Start the development server:
```bash
npm run dev
```

## Building

Build the project:
```bash
npm run build
```

## Running

Start the production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

## API Endpoints

### Chart of Accounts
- `POST /api/financial/accounts` - Create a new account
- `GET /api/financial/accounts` - Get all accounts

### Journal Entries
- `POST /api/financial/journal-entries` - Create a new journal entry
- `POST /api/financial/journal-entries/:id/post` - Post a journal entry

### Budget Management
- `POST /api/financial/budgets` - Create a new budget
- `POST /api/financial/budgets/:id/approve` - Approve a budget

### Expense Management
- `POST /api/financial/expenses` - Create a new expense
- `POST /api/financial/expenses/:id/approve` - Approve an expense

### Bank Reconciliation
- `POST /api/financial/bank-accounts/:id/reconcile` - Reconcile a bank account

### Financial Reports
- `GET /api/financial/reports/balance-sheet` - Generate balance sheet
- `GET /api/financial/reports/income-statement` - Generate income statement

## Security

The system implements several security measures:

1. Authentication using JWT
2. Role-based access control
3. Rate limiting to prevent abuse
4. Suspicious activity detection
5. Transaction monitoring
6. Comprehensive audit logging

## Monitoring

The system includes monitoring capabilities:

1. Transaction tracking
2. Failed verification tracking
3. Suspicious activity monitoring
4. Rate limit monitoring
5. Alert system for unusual activities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 