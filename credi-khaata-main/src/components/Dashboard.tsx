import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowUpRight, CreditCard, IndianRupee, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoanService } from '@/services/LoanService';
import { CustomerService } from '@/services/CustomerService';
import { LoanModel } from '@/models/Loan';

const Dashboard = () => {
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState({
    totalLoaned: 0,
    totalCollected: 0,
    overdueAmount: 0,
    avgRepaymentDays: 0,
    totalCustomers: 0,
    activeLoans: 0
  });
  const [pieData, setPieData] = useState<Array<{name: string, value: number}>>([]);
  const [overdueLoans, setOverdueLoans] = useState<Array<LoanModel & {customerName: string, daysOverdue: number}>>([]);

  const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

  const monthlyData = [
    { name: 'Jan', loans: 15000, repayments: 12000 },
    { name: 'Feb', loans: 22000, repayments: 18000 },
    { name: 'Mar', loans: 18000, repayments: 15000 },
    { name: 'Apr', loans: 25000, repayments: 16000 },
    { name: 'May', loans: 24000, repayments: 20000 },
    { name: 'Jun', loans: 21000, repayments: 17000 }
  ];

  useEffect(() => {
    if (user) {
      // Load dashboard data
      const loanSummary = LoanService.getLoanSummary(user.id);
      const customers = CustomerService.getCustomers(user.id);
      
      // Prepare summary data
      setSummaryData({
        totalLoaned: loanSummary.totalLoaned,
        totalCollected: loanSummary.totalCollected,
        overdueAmount: loanSummary.overdueAmount,
        avgRepaymentDays: loanSummary.avgRepaymentDays,
        totalCustomers: customers.length,
        activeLoans: loanSummary.activeLoans
      });
      
      // Prepare pie chart data
      setPieData([
        { name: 'Collected', value: loanSummary.totalCollected },
        { name: 'Pending', value: loanSummary.totalLoaned - loanSummary.totalCollected - loanSummary.overdueAmount },
        { name: 'Overdue', value: loanSummary.overdueAmount }
      ]);
      
      // Get overdue loans
      const overdueLoansRaw = LoanService.getOverdueLoans(user.id);
      const overdueLoansWithCustomers = overdueLoansRaw.map(loan => {
        const customer = CustomerService.getCustomerById(user.id, loan.customerId);
        const dueDate = new Date(loan.dueDate);
        const today = new Date();
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...loan,
          customerName: customer ? customer.name : 'Unknown Customer',
          daysOverdue: daysOverdue > 0 ? daysOverdue : 0
        };
      });
      
      setOverdueLoans(overdueLoansWithCustomers);
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <IndianRupee className="h-5 w-5 text-green-600 mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(summaryData.totalLoaned)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Repayments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <IndianRupee className="h-5 w-5 text-blue-600 mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(summaryData.totalCollected)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(summaryData.overdueAmount)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loans Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Loans Overview</CardTitle>
            <CardDescription>Distribution of current loans</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Loans vs. Repayments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => `₹${tick/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="loans" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="repayments" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Overdue Loans
          </CardTitle>
          <CardDescription>Loans that require immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          {overdueLoans.length > 0 ? (
            <div className="space-y-4">
              {overdueLoans.map(loan => (
                <Alert key={loan.id} variant="destructive">
                  <div className="flex items-center justify-between">
                    <div>
                      <AlertTitle>{loan.customerName}</AlertTitle>
                      <AlertDescription>
                        Amount: {formatCurrency(loan.amount)} | Overdue by {loan.daysOverdue} days
                      </AlertDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Send Reminder</Button>
                      <Button size="sm">Record Payment</Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">No overdue loans. Great job!</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Total Customers</span>
              </div>
              <Badge variant="outline" className="text-lg">{summaryData.totalCustomers}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">Active Loans</span>
              </div>
              <Badge variant="outline" className="text-lg">{summaryData.activeLoans}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ArrowUpRight className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Avg. Repayment Time</span>
              </div>
              <Badge variant="outline" className="text-lg">{summaryData.avgRepaymentDays} days</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
