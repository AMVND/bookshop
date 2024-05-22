import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyDDQquRFoP1gbup1rudzE01kKx8WqvAIck';

const Navbar = ({ user, userRole, onLogin, onSearch, onSearchResults }) => {
    const [term, setTerm] = useState('');
  
    const handleSearchChange = (event) => {
      setTerm(event.target.value);
    };
  
    const handleSearchClick = async () => {
      onSearch(term);
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}&key=${GOOGLE_BOOKS_API_KEY}`);
        onSearchResults(response.data.items || []);
      } catch (error) {
        console.error('Error fetching books:', error);
        onSearchResults([]);
      }
    };
  
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-red-500">BookShop</div>
          <div className="flex space-x-4">
            <input
              type="text"
              value={term}
              onChange={handleSearchChange}
              placeholder="Search for books..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-80"
            />
            <button onClick={handleSearchClick} className="bg-red-500 text-white px-4 py-2 rounded-lg">Search</button>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-600">Hello, {user.name}</span>
                {userRole === 'seller' ? (
                  <a href="#" className="text-gray-600">Seller Dashboard</a>
                ) : (
                  <a href="#" className="text-gray-600">Cart</a>
                )}
              </>
            ) : (
              <button onClick={onLogin} className="text-gray-600">Login</button>
            )}
          </div>
        </div>
      </header>
    );
  };
export default Navbar;
