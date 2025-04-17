
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storageService } from '../services/storageService';
import { Item } from '../types/marketplace';
import { toast } from '@/hooks/use-toast';
import { Plus, DollarSign } from 'lucide-react';

const Account = () => {
  const { user, updateUserBalance } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [soldItems, setSoldItems] = useState<Item[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Item[]>([]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  
  // Form state for adding/editing item
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadUserItems();
  }, [user, navigate]);

  const loadUserItems = () => {
    if (!user) return;
    
    const userItems = storageService.getItemsByUser(user.id);
    setItems(userItems);
    
    const userSoldItems = storageService.getSoldItems(user.id);
    setSoldItems(userSoldItems);
    
    const userPurchasedItems = storageService.getPurchasedItems(user.id);
    setPurchasedItems(userPurchasedItems);
  };

  const handleAddItem = () => {
    setItemTitle('');
    setItemDescription('');
    setItemPrice('');
    setItemCategory('');
    setEditingItem(null);
    setIsAddItemOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setItemTitle(item.title);
    setItemDescription(item.description);
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setEditingItem(item);
    setIsAddItemOpen(true);
  };

  const handleDeleteItem = (item: Item) => {
    try {
      storageService.removeItem(item.id);
      loadUserItems();
      toast({
        title: "Item Removed",
        description: "The item has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while removing the item.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) throw new Error("You must be logged in");
      
      const priceValue = parseFloat(itemPrice);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error("Price must be a positive number");
      }
      
      if (editingItem) {
        // Update existing item
        storageService.updateItem(editingItem.id, {
          title: itemTitle,
          description: itemDescription,
          price: priceValue,
          category: itemCategory,
        });
        toast({
          title: "Item Updated",
          description: "Your item has been updated successfully.",
        });
      } else {
        // Add new item
        storageService.addItem({
          sellerId: user.id,
          title: itemTitle,
          description: itemDescription,
          price: priceValue,
          category: itemCategory,
        });
        toast({
          title: "Item Added",
          description: "Your item has been listed for sale.",
        });
      }
      
      setIsAddItemOpen(false);
      loadUserItems();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) throw new Error("You must be logged in");
      
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a positive number");
      }
      
      const updatedUser = storageService.addCashToAccount(user.id, amount);
      updateUserBalance(updatedUser.cashBalance);
      
      setIsDepositOpen(false);
      setDepositAmount('');
      
      toast({
        title: "Deposit Successful",
        description: `$${amount.toFixed(2)} has been added to your account.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="marketplace-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.username}</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-4">
            <Button 
              onClick={() => setIsDepositOpen(true)} 
              variant="outline" 
              className="flex items-center"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Deposit Cash
            </Button>
            <Button 
              onClick={handleAddItem} 
              className="bg-market-primary hover:bg-market-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-800">Cash Balance</h3>
              <p className="text-2xl font-bold text-market-primary mt-2">
                ${user.cashBalance.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-800">Items for Sale</h3>
              <p className="text-2xl font-bold text-market-primary mt-2">
                {items.filter(item => item.status === 'available').length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-800">Sold Items</h3>
              <p className="text-2xl font-bold text-market-primary mt-2">
                {soldItems.length}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="myItems" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="myItems">My Items</TabsTrigger>
            <TabsTrigger value="sold">Sold Items</TabsTrigger>
            <TabsTrigger value="purchased">Purchased Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myItems">
            <h2 className="text-xl font-semibold mb-4">My Items for Sale</h2>
            {items.filter(item => item.status === 'available').length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items
                  .filter(item => item.status === 'available')
                  .map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">You don't have any items for sale yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="sold">
            <h2 className="text-xl font-semibold mb-4">Sold Items</h2>
            {soldItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {soldItems.map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't sold any items yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="purchased">
            <h2 className="text-xl font-semibold mb-4">Purchased Items</h2>
            {purchasedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {purchasedItems.map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't purchased any items yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Update your item details below' 
                : 'Fill out the details to list your item for sale'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitItem} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                placeholder="Item title"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input
                id="category"
                placeholder="Category (e.g., Electronics, Clothing)"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input
                id="description"
                placeholder="Item description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-market-primary hover:bg-market-secondary">
                {editingItem ? 'Save Changes' : 'List Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Cash</DialogTitle>
            <DialogDescription>
              Add funds to your account to purchase items
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-market-primary hover:bg-market-secondary">
                Deposit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
