# NITP Project

A web application for managing ethics complaints and financial records.

## Features

- Ethics Dashboard for managing complaints
- Complaint submission and tracking
- Financial management system
- User authentication and authorization
- Responsive design with dark mode support

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Wouter for routing
  - React Icons

- Backend:
  - Node.js
  - Express
  - TypeScript
  - Drizzle ORM
  - PostgreSQL (Neon Database)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NITP_Project
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Configure environment variables:
   - Create `.env` files in both `server` and `client` directories
   - Add necessary environment variables (see `.env.example` files)

4. Start the development servers:
   ```bash
   # Start the backend server
   cd server
   npm run dev

   # Start the frontend development server
   cd ../client
   npm run dev
   ```

## Project Structure

```
NITP_Project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── ...
│   └── ...
├── server/                # Backend Express application
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── schema/       # Database schema
│   │   └── ...
│   └── ...
└── shared/               # Shared types and utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 