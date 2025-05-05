
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, UserPlus } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  trustScore: number;
  creditLimit: number;
}

// Sample data
const initialCustomers: Customer[] = [
  { id: 1, name: 'Rahul Sharma', phone: '9876543210', address: 'A-12, Krishna Nagar, Delhi', trustScore: 8, creditLimit: 15000 },
  { id: 2, name: 'Priya Patel', phone: '8765432109', address: '15, Mohini Apartments, Andheri, Mumbai', trustScore: 9, creditLimit: 20000 },
  { id: 3, name: 'Amit Kumar', phone: '7654321098', address: 'C-5, Sector 15, Noida', trustScore: 7, creditLimit: 10000 },
  { id: 4, name: 'Sneha Gupta', phone: '6543210987', address: '42, Park Street, Kolkata', trustScore: 6, creditLimit: 8000 },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    trustScore: 5,
    creditLimit: 10000
  });
  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddNewCustomer = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      trustScore: 5,
      creditLimit: 10000
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      trustScore: customer.trustScore,
      creditLimit: customer.creditLimit
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
    toast({
      title: "Customer deleted",
      description: "The customer has been deleted successfully.",
    });
  };

  const handleSaveNewCustomer = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCustomer = {
      id: Math.max(0, ...customers.map(c => c.id)) + 1,
      ...formData
    };
    
    setCustomers([...customers, newCustomer]);
    setIsAddDialogOpen(false);
    toast({
      title: "Customer added",
      description: "New customer has been added successfully.",
    });
  };

  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return;
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer.id 
        ? { ...customer, ...formData } 
        : customer
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Customer updated",
      description: "Customer details have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Manage your customer profiles and credit limits</CardDescription>
          </div>
          <Button onClick={handleAddNewCustomer}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <Input 
              placeholder="Search customers..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Trust Score</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                customer.trustScore >= 8 ? 'bg-green-500' :
                                customer.trustScore >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${customer.trustScore * 10}%` }}
                            />
                          </div>
                          <span className="ml-2">{customer.trustScore}/10</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(customer.creditLimit)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details to add a new profile to your system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Full Name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="10-digit number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full Address"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="trust-score">Trust Score (0-10)</Label>
              <Input 
                id="trust-score" 
                type="number" 
                min="0"
                max="10"
                value={formData.trustScore} 
                onChange={(e) => setFormData({...formData, trustScore: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="credit-limit">Credit Limit (₹)</Label>
              <Input 
                id="credit-limit" 
                type="number" 
                value={formData.creditLimit} 
                onChange={(e) => setFormData({...formData, creditLimit: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewCustomer}>Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input 
                id="edit-name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input 
                id="edit-phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input 
                id="edit-address" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-trust-score">Trust Score (0-10)</Label>
              <Input 
                id="edit-trust-score" 
                type="number" 
                min="0"
                max="10"
                value={formData.trustScore} 
                onChange={(e) => setFormData({...formData, trustScore: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-credit-limit">Credit Limit (₹)</Label>
              <Input 
                id="edit-credit-limit" 
                type="number" 
                value={formData.creditLimit} 
                onChange={(e) => setFormData({...formData, creditLimit: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCustomer}>Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
