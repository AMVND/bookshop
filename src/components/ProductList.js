import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from "./ProductItem";


const GOOGLE_BOOKS_API_KEY = 'AIzaSyDDQquRFoP1gbup1rudzE01kKx8WqvAIck';

const ProductList = ({ searchTerm, searchResults }) => {
    const [books, setBooks] = useState([]);
  
    useEffect(() => {
      const fetchBooks = async () => {
        try {
            const query = searchTerm ? `q=${searchTerm}` : 'q=subject:fiction';
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?${query}&key=${GOOGLE_BOOKS_API_KEY}`);
            const booksData = response.data.items.map(item => {
              const volumeInfo = item.volumeInfo;
              return {
                id: item.id,
                title: volumeInfo.title,
                author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
                image: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
                price: volumeInfo.saleInfo && volumeInfo.saleInfo.listPrice ? volumeInfo.saleInfo.listPrice.amount : null,
              };
            });
            setBooks(booksData);
          } catch (error) {
            console.error("Error fetching books from Google Books API:", error);
          }
      };
  
      if (!searchTerm) {
        fetchBooks();
      }
    }, [searchTerm]);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 col-span-3 gap-6">
        {(searchResults || books).map(book => (
          <ProductItem key={book.id} book={book} />
        ))}
      </div>
    );
  };

export default ProductList;