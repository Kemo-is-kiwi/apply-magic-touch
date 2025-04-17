
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { storageService } from '../services/storageService';
import { Item } from '../types/marketplace';
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

const Shopping = () => {
  const { user, updateUserBalance } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadItems();
  }, [user, navigate]);

  const loadItems = () => {
    if (!user) return;
    const availableItems = storageService.getAvailableItemsExceptUser(user.id);
    setItems(availableItems);
    setFilteredItems(availableItems);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const results = storageService.searchItems(query);
    // Filter out the user's own items
    const filteredResults = results.filter(item => item.sellerId !== user?.id);
    setFilteredItems(filteredResults);
  };

  const handlePurchase = (item: Item) => {
    setSelectedItem(item);
    setIsPurchaseDialogOpen(true);
  };

  const confirmPurchase = () => {
    try {
      if (!user || !selectedItem) return;
      
      const transaction = storageService.purchaseItem(selectedItem.id, user.id);
      
      // Update the user's balance in context
      const updatedUser = storageService.getUserById(user.id);
      if (updatedUser) {
        updateUserBalance(updatedUser.cashBalance);
      }
      
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${selectedItem.title} for $${selectedItem.price.toFixed(2)}.`,
      });
      
      setIsPurchaseDialogOpen(false);
      loadItems();
      
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An error occurred during the purchase.",
        variant: "destructive",
      });
      setIsPurchaseDialogOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      <div className="marketplace-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shop Items</h1>
            <p className="text-gray-600 mt-1">Browse items from other users</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex">
              <Input
                type="search"
                placeholder="Search for items..."
                className="w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                onClick={() => handleSearch(searchQuery)} 
                variant="outline" 
                className="ml-2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onPurchase={handlePurchase}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchQuery ? 
                `No items matching "${searchQuery}" were found.` : 
                "There are no items available for purchase at the moment."}
            </p>
          </div>
        )}
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to buy this item?
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <h3 className="font-medium text-lg">{selectedItem.title}</h3>
              <p className="text-gray-600 mb-2">{selectedItem.description}</p>
              <p className="text-xl font-bold text-market-primary">
                ${selectedItem.price.toFixed(2)}
              </p>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Your balance: <span className="font-medium">${user.cashBalance.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  After purchase: <span className="font-medium">${(user.cashBalance - selectedItem.price).toFixed(2)}</span>
                </p>
              </div>
              
              {user.cashBalance < selectedItem.price && (
                <p className="text-red-500 text-sm mt-2">
                  Insufficient funds. Please deposit more cash to your account.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPurchaseDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmPurchase} 
              disabled={!selectedItem || user.cashBalance < (selectedItem?.price || 0)}
              className="bg-market-primary hover:bg-market-secondary"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shopping;
