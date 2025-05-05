
import { customers, CustomerModel } from '../models/Customer';

export class CustomerService {
  static getCustomers(userId: string): CustomerModel[] {
    return customers.filter(customer => customer.userId === userId);
  }
  
  static getCustomerById(userId: string, customerId: string): CustomerModel | undefined {
    return customers.find(customer => customer.userId === userId && customer.id === customerId);
  }
  
  static createCustomer(customerData: Omit<CustomerModel, 'id' | 'createdAt'>): CustomerModel {
    const newCustomer: CustomerModel = {
      ...customerData,
      id: (customers.length + 1).toString(),
      createdAt: new Date()
    };
    
    customers.push(newCustomer);
    return newCustomer;
  }
  
  static updateCustomer(userId: string, customerId: string, customerData: Partial<CustomerModel>): CustomerModel | undefined {
    const index = customers.findIndex(customer => customer.userId === userId && customer.id === customerId);
    
    if (index === -1) {
      return undefined;
    }
    
    customers[index] = {
      ...customers[index],
      ...customerData
    };
    
    return customers[index];
  }
  
  static deleteCustomer(userId: string, customerId: string): boolean {
    const index = customers.findIndex(customer => customer.userId === userId && customer.id === customerId);
    
    if (index === -1) {
      return false;
    }
    
    customers.splice(index, 1);
    return true;
  }
}
