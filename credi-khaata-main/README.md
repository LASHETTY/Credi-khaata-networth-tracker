
# CrediKhaata Keeper

A simple application for small shop owners to manage customer credit accounts (khaata), track loans, and record repayments.

## Project Overview

CrediKhaata Keeper helps small business owners:
- Track customers and their credit limits
- Record loans given to customers
- Manage repayments and maintain transaction history
- View summaries of outstanding balances

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd credi-khaata-keeper

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Features

- **Customer Management**: Add and manage customers with trust scores and credit limits
- **Loan Tracking**: Record loans given to customers with amount, date, and purpose
- **Repayment Management**: Track customer repayments with receipt numbers
- **Dashboard Overview**: View summary of loans, repayments, and outstanding balances

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Project Structure

```
src/
  ├── components/    # UI components
  ├── contexts/      # Context providers
  ├── models/        # Data models
  ├── pages/         # Application pages
  ├── services/      # Business logic
  └── hooks/         # Custom React hooks
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
