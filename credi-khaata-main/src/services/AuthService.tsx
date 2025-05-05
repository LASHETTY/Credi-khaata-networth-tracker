
import { users, UserModel } from '../models/User';

export class AuthService {
  static login(email: string, password: string): { user: Omit<UserModel, 'password'>, token: string } | null {
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
      return null;
    }
    
    // In a real app, we would generate a JWT token here
    const token = `mock-jwt-token-${Date.now()}`;
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
  
  static register(name: string, email: string, password: string): { user: Omit<UserModel, 'password'>, token: string } | null {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return null;
    }
    
    // Create new user
    const newUser: UserModel = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // In a real app, we would generate a JWT token here
    const token = `mock-jwt-token-${Date.now()}`;
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }
  
  static getCurrentUser(token: string): Omit<UserModel, 'password'> | null {
    // In a real app, we would verify the JWT token and get the user ID
    // For now, we'll just return the first user
    if (!token) return null;
    
    const user = users[0];
    if (!user) return null;
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
