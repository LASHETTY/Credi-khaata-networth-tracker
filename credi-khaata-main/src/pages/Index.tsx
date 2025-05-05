
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from '@/components/Dashboard';
import Customers from '@/components/Customers';
import Loans from '@/components/Loans';
import Repayments from '@/components/Repayments';
import AuthForm from '@/components/AuthForm';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogin = (success: boolean) => {
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back to CrediKhaata!",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                <span className="text-green-600">Credi</span>
                <span className="text-blue-700">Khaata</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Loan Tracker for Shopkeepers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm onLogin={handleLogin} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-green-600">Credi</span>
              <span className="text-blue-700">Khaata</span>
            </h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              logout();
              toast({
                title: "Logged out",
                description: "You have been logged out successfully.",
              });
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="repayments">Repayments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="customers">
            <Customers />
          </TabsContent>
          
          <TabsContent value="loans">
            <Loans />
          </TabsContent>
          
          <TabsContent value="repayments">
            <Repayments />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
