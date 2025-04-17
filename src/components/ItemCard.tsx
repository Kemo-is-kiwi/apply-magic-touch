
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Item } from '../types/marketplace';

interface ItemCardProps {
  item: Item;
  onPurchase?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  showActions?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onPurchase, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="bg-gray-100 h-48 flex items-center justify-center">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.title} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-gray-400 text-3xl">No Image</div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Category: {item.category}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
        <p className="mt-2 text-xl font-semibold text-market-primary">${item.price.toFixed(2)}</p>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-between">
          {onPurchase && item.status === 'available' && (
            <Button 
              onClick={() => onPurchase(item)} 
              className="w-full bg-market-primary hover:bg-market-secondary"
            >
              Buy Now
            </Button>
          )}
          
          {onEdit && (
            <Button 
              onClick={() => onEdit(item)} 
              variant="outline" 
              className="flex-1 mr-2"
            >
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button 
              onClick={() => onDelete(item)} 
              variant="destructive" 
              className="flex-1"
            >
              Remove
            </Button>
          )}
        </CardFooter>
      )}
      
      {item.status === 'sold' && (
        <CardFooter>
          <div className="bg-gray-200 text-gray-700 font-semibold w-full text-center py-2 rounded">
            Sold
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ItemCard;
