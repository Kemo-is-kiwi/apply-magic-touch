
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="marketplace-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-market-primary">
              MarketMagic
            </Link>
            {user && (
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="w-64 mr-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:block text-sm text-gray-600">
                  <span>Balance: </span>
                  <span className="font-medium">${user.cashBalance.toFixed(2)}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/account')} 
                  className="text-market-secondary"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Account</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/shopping')} 
                  className="text-market-secondary"
                >
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Shop</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={logout} 
                  className="text-market-secondary"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')} 
                  className="text-market-secondary"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="bg-market-primary hover:bg-market-secondary text-white"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
