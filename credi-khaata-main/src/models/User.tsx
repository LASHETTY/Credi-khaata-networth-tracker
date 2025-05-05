
// Simulated MongoDB model for User
export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
}

export const users: UserModel[] = [
  {
    id: "1",
    name: "Demo Shop",
    email: "demo@example.com",
    password: "password123", // This would be hashed in a real application
    createdAt: new Date()
  }
];
