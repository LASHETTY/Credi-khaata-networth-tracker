
import { loans, LoanModel, LoanStatus } from '../models/Loan';
import { differenceInDays } from 'date-fns';

export class LoanService {
  static getLoans(userId: string): LoanModel[] {
    return loans.filter(loan => loan.userId === userId);
  }
  
  static getLoanById(userId: string, loanId: string): LoanModel | undefined {
    return loans.find(loan => loan.userId === userId && loan.id === loanId);
  }
  
  static getCustomerLoans(userId: string, customerId: string): LoanModel[] {
    return loans.filter(loan => loan.userId === userId && loan.customerId === customerId);
  }
  
  static createLoan(loanData: Omit<LoanModel, 'id' | 'status' | 'createdAt'>): LoanModel {
    const newLoan: LoanModel = {
      ...loanData,
      id: (loans.length + 1).toString(),
      status: 'pending',
      createdAt: new Date()
    };
    
    loans.push(newLoan);
    return newLoan;
  }
  
  static updateLoan(userId: string, loanId: string, loanData: Partial<LoanModel>): LoanModel | undefined {
    const index = loans.findIndex(loan => loan.userId === userId && loan.id === loanId);
    
    if (index === -1) {
      return undefined;
    }
    
    loans[index] = {
      ...loans[index],
      ...loanData
    };
    
    return loans[index];
  }
  
  static updateLoanStatus(): void {
    const today = new Date();
    
    loans.forEach(loan => {
      if (loan.status === 'paid') {
        return;
      }
      
      if (loan.remainingAmount === 0) {
        loan.status = 'paid';
        return;
      }
      
      const daysOverdue = differenceInDays(today, loan.dueDate);
      
      if (daysOverdue > (loan.graceDays || 0)) {
        loan.status = 'overdue';
      }
    });
  }
  
  static getOverdueLoans(userId: string): LoanModel[] {
    this.updateLoanStatus();
    return loans.filter(loan => loan.userId === userId && loan.status === 'overdue');
  }
  
  static getLoanSummary(userId: string) {
    const userLoans = this.getLoans(userId);
    const totalLoaned = userLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalCollected = userLoans.reduce((sum, loan) => sum + (loan.amount - loan.remainingAmount), 0);
    const overdueLoans = this.getOverdueLoans(userId);
    const overdueAmount = overdueLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
    const activeLoans = userLoans.filter(loan => loan.status !== 'paid').length;
    
    // This is a simplified calculation of average repayment days
    const avgRepaymentDays = 12; // In a real app, this would be calculated from actual data
    
    return {
      totalLoaned,
      totalCollected,
      overdueAmount,
      avgRepaymentDays,
      totalLoans: userLoans.length,
      activeLoans
    };
  }
}
