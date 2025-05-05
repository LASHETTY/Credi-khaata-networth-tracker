
// Simulated MongoDB model for Customer
export interface CustomerModel {
  id: string;
  userId: string; // Foreign key to shop owner
  name: string;
  phone: string;
  address: string;
  trustScore: number; // 0-10
  creditLimit: number;
  createdAt: Date;
}

export const customers: CustomerModel[] = [
  {
    id: "1",
    userId: "1",
    name: "Rahul Sharma",
    phone: "9876543210",
    address: "123 Main St, Delhi",
    trustScore: 8,
    creditLimit: 10000,
    createdAt: new Date()
  },
  {
    id: "2",
    userId: "1",
    name: "Priya Patel",
    phone: "8765432109",
    address: "456 Park Ave, Mumbai",
    trustScore: 9,
    creditLimit: 15000,
    createdAt: new Date()
  },
  {
    id: "3",
    userId: "1",
    name: "Amit Kumar",
    phone: "7654321098",
    address: "789 Oak St, Bangalore",
    trustScore: 7,
    creditLimit: 8000,
    createdAt: new Date()
  }
];
