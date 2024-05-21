import React from "react";
const ProductItem = ({ title, author, price }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <img src="https://via.placeholder.com/150" alt="Book Image" className="w-full h-48 object-cover mb-4 rounded-lg" />
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{author}</p>
            <div className="flex justify-between items-center">
                <span className="text-red-500 font-bold">${price}</span>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Add to Cart</button>
            </div>
        </div>
    );
};
export default ProductItem