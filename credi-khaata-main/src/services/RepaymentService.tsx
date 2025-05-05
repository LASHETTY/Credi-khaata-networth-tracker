
import { repayments, RepaymentModel } from '../models/Repayment';
import { loans } from '../models/Loan';

export class RepaymentService {
  static getRepayments(userId: string): RepaymentModel[] {
    return repayments.filter(repayment => repayment.userId === userId);
  }
  
  static getLoanRepayments(userId: string, loanId: string): RepaymentModel[] {
    return repayments.filter(repayment => repayment.userId === userId && repayment.loanId === loanId);
  }
  
  static createRepayment(repaymentData: Omit<RepaymentModel, 'id' | 'receiptNumber' | 'createdAt'>): RepaymentModel | null {
    // Find the loan
    const loan = loans.find(loan => 
      loan.userId === repaymentData.userId && 
      loan.id === repaymentData.loanId
    );
    
    if (!loan) {
      return null;
    }
    
    // Check if repayment amount is valid
    if (repaymentData.amount <= 0 || repaymentData.amount > loan.remainingAmount) {
      return null;
    }
    
    // Create a receipt number
    const receiptNumber = `RCP-${new Date().getFullYear()}-${(repayments.length + 1).toString().padStart(3, '0')}`;
    
    // Create the repayment
    const newRepayment: RepaymentModel = {
      ...repaymentData,
      id: (repayments.length + 1).toString(),
      receiptNumber,
      createdAt: new Date()
    };
    
    // Update the loan remaining amount
    loan.remainingAmount -= repaymentData.amount;
    
    // If the loan is fully paid, update its status
    if (loan.remainingAmount === 0) {
      loan.status = 'paid';
    }
    
    repayments.push(newRepayment);
    return newRepayment;
  }
}
