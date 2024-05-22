import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductItem = ({ book }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/book/${book.id}`);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={handleClick}>
            <img src={book.image} alt="Book Image" className="w-full h-64 object-cover mb-4 rounded-lg" />
            <h3 className="font-bold text-lg mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-4">{book.author}</p>
            <div className="flex justify-between items-center">
                <span className="text-red-500 font-bold">{book.price ? `$${book.price}` : 'Free'}</span>
            </div>
        </div>
    );
};

export default ProductItem