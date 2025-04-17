
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">Welcome to</span>
            <span className="block text-market-primary mt-1">MarketMagic</span>
          </h1>
          <p className="mt-5 max-w-md mx-auto text-xl text-gray-500">
            Buy and sell items in our distributed online marketplace
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/shopping')} 
                  className="bg-market-primary hover:bg-market-secondary text-white px-6 py-3 text-lg rounded-md"
                >
                  Shop Now
                </Button>
                <Button 
                  onClick={() => navigate('/account')} 
                  variant="outline"
                  className="px-6 py-3 text-lg rounded-md"
                >
                  My Account
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="bg-market-primary hover:bg-market-secondary text-white px-6 py-3 text-lg rounded-md"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline"
                  className="px-6 py-3 text-lg rounded-md"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">
              Our marketplace makes buying and selling simple
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-market-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-medium text-gray-900">Create an account</h3>
                <p className="mt-2 text-gray-500">
                  Sign up for free and set up your profile to start buying and selling
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-market-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium text-gray-900">List your items</h3>
                <p className="mt-2 text-gray-500">
                  Add items you want to sell with descriptions and prices
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-market-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium text-gray-900">Buy & Sell</h3>
                <p className="mt-2 text-gray-500">
                  Purchase items from other users or sell your own items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-market-primary bg-opacity-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need for a smooth trading experience
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Secure Transactions</h3>
              <p className="mt-2 text-gray-500">
                Buy and sell with confidence through our secure transaction system
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <p className="mt-2 text-gray-500">
                Create an account, manage your profile, and track your activity
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
              <p className="mt-2 text-gray-500">
                Easily manage your items for sale and track sold items
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Search Functionality</h3>
              <p className="mt-2 text-gray-500">
                Find items for sale using our powerful search features
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Cash Management</h3>
              <p className="mt-2 text-gray-500">
                Deposit funds and track your balance for purchases
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Transaction Reports</h3>
              <p className="mt-2 text-gray-500">
                View detailed reports of your buying and selling activity
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">MarketMagic</h2>
            <p className="mt-4 text-gray-300">
              © 2025 MarketMagic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
