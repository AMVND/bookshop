import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyDDQquRFoP1gbup1rudzE01kKx8WqvAIck';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
  
    useEffect(() => {
      const fetchBook = async () => {
        try {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_API_KEY}`);
          setBook(response.data.volumeInfo);
        } catch (error) {
          console.error("Error fetching book details from Google Books API:", error);
        }
      };
  
      fetchBook();
    }, [id]);
  
    if (!book) return <div>Loading...</div>;
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img src={book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/150'} alt="Book Image" className="w-full h-48 object-cover mb-4 rounded-lg" />
        <h1 className="font-bold text-2xl mb-2">{book.title}</h1>
        <h2 className="text-gray-600 mb-4">{book.authors ? book.authors.join(', ') : 'Unknown Author'}</h2>
        <p className="text-gray-800 mb-4">{book.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-red-500 font-bold">{book.saleInfo && book.saleInfo.listPrice ? `$${book.saleInfo.listPrice.amount}` : 'Free'}</span>
        </div>
      </div>
    );
  };

export default BookDetails;
