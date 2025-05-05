
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: number;
  name: string;
}

interface Loan {
  id: number;
  customerId: number;
  customerName: string;
  description: string;
  amount: number;
  issuedDate: Date;
  dueDate: Date;
  frequency: "bi-weekly" | "monthly";
  status: "pending" | "paid" | "overdue";
  remainingAmount: number;
}

// Sample customers
const customers: Customer[] = [
  { id: 1, name: 'Rahul Sharma' },
  { id: 2, name: 'Priya Patel' },
  { id: 3, name: 'Amit Kumar' },
  { id: 4, name: 'Sneha Gupta' },
];

// Sample loans
const initialLoans: Loan[] = [
  { 
    id: 1, 
    customerId: 1, 
    customerName: "Rahul Sharma",
    description: "Groceries", 
    amount: 5000, 
    issuedDate: new Date(2025, 4, 1), 
    dueDate: new Date(2025, 5, 1), 
    frequency: "monthly",
    status: "pending",
    remainingAmount: 5000
  },
  { 
    id: 2, 
    customerId: 2, 
    customerName: "Priya Patel",
    description: "Kitchen appliances", 
    amount: 8000, 
    issuedDate: new Date(2025, 3, 15), 
    dueDate: new Date(2025, 4, 15), 
    frequency: "monthly",
    status: "overdue",
    remainingAmount: 3000
  },
  { 
    id: 3, 
    customerId: 3, 
    customerName: "Amit Kumar",
    description: "Hardware items", 
    amount: 3500, 
    issuedDate: new Date(2025, 4, 1), 
    dueDate: new Date(2025, 4, 15), 
    frequency: "bi-weekly",
    status: "paid",
    remainingAmount: 0
  },
];

const Loans = () => {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: 0,
    description: '',
    amount: 0,
    issuedDate: new Date(),
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    frequency: "monthly" as "bi-weekly" | "monthly"
  });
  const { toast } = useToast();

  const filteredLoans = loans.filter(loan => 
    loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewLoan = () => {
    setFormData({
      customerId: 0,
      description: '',
      amount: 0,
      issuedDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      frequency: "monthly"
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveNewLoan = () => {
    if (!formData.customerId || !formData.description || formData.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields with valid data",
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

    const newLoan = {
      id: Math.max(0, ...loans.map(l => l.id)) + 1,
      customerName: selectedCustomer.name,
      status: "pending" as "pending" | "paid" | "overdue",
      remainingAmount: formData.amount,
      ...formData
    };
    
    setLoans([...loans, newLoan]);
    setIsAddDialogOpen(false);
    toast({
      title: "Loan created",
      description: `New loan of ₹${formData.amount.toLocaleString('en-IN')} issued to ${selectedCustomer.name}`,
    });
  };

  const getLoanStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Loans</CardTitle>
            <CardDescription>Manage credit transactions with your customers</CardDescription>
          </div>
          <Button onClick={handleAddNewLoan}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <Input 
              placeholder="Search loans..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.customerName}</TableCell>
                      <TableCell>{loan.description}</TableCell>
                      <TableCell>{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(loan.amount)}</TableCell>
                      <TableCell>{format(loan.issuedDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(loan.dueDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                      <TableCell>{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(loan.remainingAmount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No loans found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Loan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue New Loan</DialogTitle>
            <DialogDescription>
              Enter loan details to create a new credit transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, customerId: parseInt(value)})}
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
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="E.g., Groceries, Appliances, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Loan Amount (₹)</Label>
              <Input 
                id="amount" 
                type="number"
                value={formData.amount || ''} 
                onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                placeholder="Enter amount"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issued-date">Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issuedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.issuedDate ? format(formData.issuedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.issuedDate}
                    onSelect={(date) => date && setFormData({...formData, issuedDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => date && setFormData({...formData, dueDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="frequency">Payment Frequency</Label>
              <Select 
                defaultValue={formData.frequency}
                onValueChange={(value) => setFormData({...formData, frequency: value as "bi-weekly" | "monthly"})}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewLoan}>Create Loan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loans;
