
import { User, Item, Transaction } from '../types/marketplace';

// Mock database storage
class StorageService {
  private users: User[] = [];
  private items: Item[] = [];
  private transactions: Transaction[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromLocalStorage();
    this.setupSampleData();
  }

  private loadFromLocalStorage() {
    try {
      const users = localStorage.getItem('users');
      const items = localStorage.getItem('items');
      const transactions = localStorage.getItem('transactions');
      const currentUser = localStorage.getItem('currentUser');

      if (users) this.users = JSON.parse(users);
      if (items) this.items = JSON.parse(items);
      if (transactions) this.transactions = JSON.parse(transactions);
      if (currentUser) this.currentUser = JSON.parse(currentUser);
    } catch (error) {
      console.error('Error loading from localStorage', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
      if (this.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  private setupSampleData() {
    // Only add sample data if no data exists
    if (this.users.length === 0) {
      // Add sample users
      const sampleUsers: User[] = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123',
          cashBalance: 1000,
          createdAt: new Date(),
        },
        {
          id: '2',
          username: 'jane_smith',
          email: 'jane@example.com',
          password: 'password123',
          cashBalance: 1500,
          createdAt: new Date(),
        },
      ];

      // Add sample items
      const sampleItems: Item[] = [
        {
          id: '1',
          sellerId: '1',
          title: 'Vintage Camera',
          description: 'A beautiful vintage camera in excellent condition',
          price: 250,
          category: 'Electronics',
          status: 'available',
          createdAt: new Date(),
        },
        {
          id: '2',
          sellerId: '1',
          title: 'Mountain Bike',
          description: 'High-quality mountain bike, barely used',
          price: 450,
          category: 'Sports',
          status: 'available',
          createdAt: new Date(),
        },
        {
          id: '3',
          sellerId: '2',
          title: 'Designer Watch',
          description: 'Luxury designer watch, water resistant',
          price: 350,
          category: 'Fashion',
          status: 'available',
          createdAt: new Date(),
        },
        {
          id: '4',
          sellerId: '2',
          title: 'Laptop Stand',
          description: 'Ergonomic laptop stand, adjustable height',
          price: 75,
          category: 'Office',
          status: 'available',
          createdAt: new Date(),
        },
      ];

      this.users = sampleUsers;
      this.items = sampleItems;
      this.saveToLocalStorage();
    }
  }

  // User methods
  public registerUser(username: string, email: string, password: string): User {
    // Check if user already exists
    if (this.users.some(user => user.email === email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username,
      email,
      password, // In a real app, we'd hash this
      cashBalance: 500, // Start with some cash
      createdAt: new Date(),
    };

    this.users.push(newUser);
    this.saveToLocalStorage();
    return newUser;
  }

  public loginUser(email: string, password: string): User {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    this.currentUser = user;
    this.saveToLocalStorage();
    return user;
  }

  public logoutUser(): void {
    this.currentUser = null;
    this.saveToLocalStorage();
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public addCashToAccount(userId: string, amount: number): User {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].cashBalance += amount;

    // Update current user if it's the same user
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = this.users[userIndex];
    }

    this.saveToLocalStorage();
    return this.users[userIndex];
  }

  // Item methods
  public addItem(item: Omit<Item, 'id' | 'createdAt' | 'status'>): Item {
    const newItem: Item = {
      ...item,
      id: (this.items.length + 1).toString(),
      status: 'available',
      createdAt: new Date(),
    };

    this.items.push(newItem);
    this.saveToLocalStorage();
    return newItem;
  }

  public updateItem(id: string, updates: Partial<Item>): Item {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    // Ensure we don't update certain fields
    const { id: _, createdAt: __, ...validUpdates } = updates;

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...validUpdates,
    };

    this.saveToLocalStorage();
    return this.items[itemIndex];
  }

  public removeItem(id: string): void {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    this.items.splice(itemIndex, 1);
    this.saveToLocalStorage();
  }

  public getItemsByUser(userId: string): Item[] {
    return this.items.filter(item => item.sellerId === userId);
  }

  public getAvailableItems(): Item[] {
    return this.items.filter(item => item.status === 'available');
  }

  public getAvailableItemsExceptUser(userId: string): Item[] {
    return this.items.filter(item => item.status === 'available' && item.sellerId !== userId);
  }

  public getItemById(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  public searchItems(query: string): Item[] {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(item => 
      item.status === 'available' && 
      (item.title.toLowerCase().includes(lowerQuery) || 
       item.description.toLowerCase().includes(lowerQuery) ||
       item.category.toLowerCase().includes(lowerQuery))
    );
  }

  // Transaction methods
  public purchaseItem(itemId: string, buyerId: string): Transaction {
    const item = this.getItemById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    if (item.status === 'sold') {
      throw new Error('Item is already sold');
    }

    const buyer = this.getUserById(buyerId);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const seller = this.getUserById(item.sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    if (buyer.cashBalance < item.price) {
      throw new Error('Insufficient funds');
    }

    // Update buyer's balance
    const buyerIndex = this.users.findIndex(user => user.id === buyerId);
    this.users[buyerIndex].cashBalance -= item.price;

    // Update seller's balance
    const sellerIndex = this.users.findIndex(user => user.id === item.sellerId);
    this.users[sellerIndex].cashBalance += item.price;

    // Update item status
    const itemIndex = this.items.findIndex(i => i.id === itemId);
    this.items[itemIndex].status = 'sold';

    // Create transaction record
    const transaction: Transaction = {
      id: (this.transactions.length + 1).toString(),
      itemId,
      sellerId: item.sellerId,
      buyerId,
      price: item.price,
      timestamp: new Date(),
    };

    this.transactions.push(transaction);

    // Update current user if it's the buyer
    if (this.currentUser && this.currentUser.id === buyerId) {
      this.currentUser = this.users[buyerIndex];
    }

    this.saveToLocalStorage();
    return transaction;
  }

  public getUserTransactions(userId: string): Transaction[] {
    return this.transactions.filter(
      transaction => transaction.buyerId === userId || transaction.sellerId === userId
    );
  }

  public getPurchasedItems(userId: string): Item[] {
    const purchasedItemIds = this.transactions
      .filter(transaction => transaction.buyerId === userId)
      .map(transaction => transaction.itemId);
    
    return this.items.filter(item => purchasedItemIds.includes(item.id));
  }

  public getSoldItems(userId: string): Item[] {
    const soldItemIds = this.transactions
      .filter(transaction => transaction.sellerId === userId)
      .map(transaction => transaction.itemId);
    
    return this.items.filter(item => soldItemIds.includes(item.id));
  }
}

// Export as a singleton
export const storageService = new StorageService();
