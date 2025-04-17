
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, we'd never store plaintext passwords
  cashBalance: number;
  createdAt: Date;
}

export interface Item {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  status: 'available' | 'sold';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  itemId: string;
  sellerId: string;
  buyerId: string;
  price: number;
  timestamp: Date;
}

export interface CartItem {
  item: Item;
  quantity: number;
}
