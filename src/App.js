import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';
import BookDetails from './pages/BookDetails';


const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleLogin = async () => {
    setUser({ name: 'John Doe' });
    setUserRole('buyer'); // or 'seller'
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar user={user} userRole={userRole} onLogin={handleLogin} onSearch={handleSearch} onSearchResults={handleSearchResults} />
        <Header/>
        <main className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Sidebar />
                <ProductList searchTerm={searchTerm} searchResults={searchResults} />
              </div>
            } />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
