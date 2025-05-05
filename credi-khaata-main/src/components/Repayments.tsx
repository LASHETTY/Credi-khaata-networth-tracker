
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: number;
  name: string;
}

interface Loan {
  id: number;
  customerId: number;
  customerName: string;
  amount: number;
  remainingAmount: number;
}

interface Repayment {
  id: number;
  loanId: number;
  customerId: number;
  customerName: string;
  amount: number;
  date: Date;
  receiptNumber: string;
}

// Sample customers
const customers: Customer[] = [
  { id: 1, name: 'Rahul Sharma' },
  { id: 2, name: 'Priya Patel' },
  { id: 3, name: 'Amit Kumar' },
  { id: 4, name: 'Sneha Gupta' },
];

// Sample loans
const loans: Loan[] = [
  { id: 1, customerId: 1, customerName: "Rahul Sharma", amount: 5000, remainingAmount: 5000 },
  { id: 2, customerId: 2, customerName: "Priya Patel", amount: 8000, remainingAmount: 3000 },
  { id: 3, customerId: 3, customerName: "Amit Kumar", amount: 3500, remainingAmount: 0 },
];

// Sample repayments
const initialRepayments: Repayment[] = [
  {
    id: 1,
    loanId: 2,
    customerId: 2,
    customerName: "Priya Patel",
    amount: 5000,
    date: new Date(2025, 4, 1),
    receiptNumber: "RCP-2025-001"
  },
  {
    id: 2,
    loanId: 3,
    customerId: 3,
    customerName: "Amit Kumar",
    amount: 3500,
    date: new Date(2025, 4, 2),
    receiptNumber: "RCP-2025-002"
  }
];

const Repayments = () => {
  const [repayments, setRepayments] = useState<Repayment[]>(initialRepayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: 0,
    loanId: 0,
    amount: 0,
    date: new Date(),
  });
  const [selectedCustomerLoans, setSelectedCustomerLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { toast } = useToast();

  const filteredRepayments = repayments.filter(repayment => 
    repayment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repayment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewRepayment = () => {
    setFormData({
      customerId: 0,
      loanId: 0,
      amount: 0,
      date: new Date(),
    });
    setSelectedCustomerLoans([]);
    setSelectedLoan(null);
    setIsAddDialogOpen(true);
  };

  const handleCustomerChange = (customerId: number) => {
    const customerLoans = loans.filter(loan => 
      loan.customerId === customerId && loan.remainingAmount > 0
    );
    setSelectedCustomerLoans(customerLoans);
    setFormData({
      ...formData,
      customerId,
      loanId: 0,
      amount: 0
    });
  };

  const handleLoanChange = (loanId: number) => {
    const loan = loans.find(l => l.id === loanId);
    setSelectedLoan(loan || null);
    setFormData({
      ...formData,
      loanId,
      amount: loan ? loan.remainingAmount : 0
    });
  };

  const handleSaveNewRepayment = () => {
    if (!formData.customerId || !formData.loanId || formData.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields with valid data",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLoan) {
      toast({
        title: "Error",
        description: "Please select a valid loan",
        variant: "destructive",
      });
      return;
    }

    if (formData.amount > selectedLoan.remainingAmount) {
      toast({
        title: "Error",
        description: "Repayment amount cannot exceed the remaining loan amount",
        variant: "destructive",
      });
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a valid customer",
        variant: "destructive",
      });
      return;
    }

    const newRepayment = {
      id: Math.max(0, ...repayments.map(r => r.id)) + 1,
      loanId: formData.loanId,
      customerId: formData.customerId,
      customerName: selectedCustomer.name,
      amount: formData.amount,
      date: formData.date,
      receiptNumber: `RCP-${format(new Date(), 'yyyy')}-${(repayments.length + 1).toString().padStart(3, '0')}`
    };
    
    setRepayments([...repayments, newRepayment]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Repayment recorded",
      description: `Repayment of ₹${formData.amount.toLocaleString('en-IN')} from ${selectedCustomer.name} has been recorded`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Repayments</CardTitle>
            <CardDescription>Track and record loan repayments from customers</CardDescription>
          </div>
          <Button onClick={handleAddNewRepayment}>
            <Receipt className="h-4 w-4 mr-2" />
            Record Repayment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <Input 
              placeholder="Search repayments..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepayments.length > 0 ? (
                  filteredRepayments.map((repayment) => (
                    <TableRow key={repayment.id}>
                      <TableCell className="font-medium">{repayment.receiptNumber}</TableCell>
                      <TableCell>{repayment.customerName}</TableCell>
                      <TableCell>{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(repayment.amount)}</TableCell>
                      <TableCell>{format(repayment.date, 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No repayments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Repayment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Repayment</DialogTitle>
            <DialogDescription>
              Enter repayment details to record a new payment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select 
                onValueChange={(value) => handleCustomerChange(parseInt(value))}
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="loan">Loan</Label>
              <Select 
                disabled={!formData.customerId || selectedCustomerLoans.length === 0}
                onValueChange={(value) => handleLoanChange(parseInt(value))}
              >
                <SelectTrigger id="loan">
                  <SelectValue placeholder={
                    !formData.customerId 
                      ? "Select a customer first" 
                      : selectedCustomerLoans.length === 0 
                        ? "No active loans found" 
                        : "Select a loan"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {selectedCustomerLoans.map(loan => (
                    <SelectItem key={loan.id} value={loan.id.toString()}>
                      {loan.amount.toLocaleString('en-IN')} - Remaining: {loan.remainingAmount.toLocaleString('en-IN')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Repayment Amount (₹)</Label>
              <Input 
                id="amount" 
                type="number"
                value={formData.amount || ''} 
                onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                placeholder="Enter amount"
                disabled={!selectedLoan}
                max={selectedLoan?.remainingAmount}
              />
              {selectedLoan && (
                <p className="text-xs text-muted-foreground">
                  Maximum allowed: ₹{selectedLoan.remainingAmount.toLocaleString('en-IN')}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({...formData, date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewRepayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Repayments;
