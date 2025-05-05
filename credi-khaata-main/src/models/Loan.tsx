
// Simulated MongoDB model for Loan
export type LoanStatus = 'pending' | 'paid' | 'overdue';
export type PaymentFrequency = 'weekly' | 'bi-weekly' | 'monthly';

export interface LoanModel {
  id: string;
  userId: string; // Foreign key to shop owner
  customerId: string; // Foreign key to customer
  description: string;
  amount: number;
  remainingAmount: number;
  issueDate: Date;
  dueDate: Date;
  frequency: PaymentFrequency;
  interest?: number; // Optional: interest percentage
  graceDays?: number; // Optional: grace period in days
  status: LoanStatus;
  createdAt: Date;
}

export const loans: LoanModel[] = [
  {
    id: "1",
    userId: "1",
    customerId: "1",
    description: "Grocery items",
    amount: 5000,
    remainingAmount: 5000,
    issueDate: new Date(2025, 3, 15),
    dueDate: new Date(2025, 4, 15),
    frequency: "monthly",
    interest: 2,
    graceDays: 5,
    status: "pending",
    createdAt: new Date(2025, 3, 15)
  },
  {
    id: "2",
    userId: "1",
    customerId: "2",
    description: "Home appliances",
    amount: 8000,
    remainingAmount: 3000,
    issueDate: new Date(2025, 3, 10),
    dueDate: new Date(2025, 4, 10),
    frequency: "monthly",
    status: "pending",
    createdAt: new Date(2025, 3, 10)
  },
  {
    id: "3",
    userId: "1",
    customerId: "3",
    description: "Hardware tools",
    amount: 3500,
    remainingAmount: 0,
    issueDate: new Date(2025, 3, 5),
    dueDate: new Date(2025, 4, 5),
    frequency: "bi-weekly",
    status: "paid",
    createdAt: new Date(2025, 3, 5)
  }
];
