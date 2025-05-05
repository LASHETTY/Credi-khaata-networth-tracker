
// Simulated MongoDB model for Repayment
export interface RepaymentModel {
  id: string;
  userId: string; // Foreign key to shop owner
  loanId: string; // Foreign key to loan
  customerId: string; // Foreign key to customer
  amount: number;
  date: Date;
  receiptNumber: string;
  createdAt: Date;
}

export const repayments: RepaymentModel[] = [
  {
    id: "1",
    userId: "1",
    loanId: "2",
    customerId: "2",
    amount: 5000,
    date: new Date(2025, 4, 1),
    receiptNumber: "RCP-2025-001",
    createdAt: new Date(2025, 4, 1)
  },
  {
    id: "2",
    userId: "1",
    loanId: "3",
    customerId: "3",
    amount: 3500,
    date: new Date(2025, 4, 2),
    receiptNumber: "RCP-2025-002",
    createdAt: new Date(2025, 4, 2)
  }
];
