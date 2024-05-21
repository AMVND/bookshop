import React from "react";
import ProductItem from "./ProductItem";
const ProductList = () => {
    // Dummy data for products
    const products = [
        { id: 1, title: 'Book 1', author: 'Author 1', price: 19.99 },
        { id: 2, title: 'Book 2', author: 'Author 2', price: 24.99 },
        { id: 3, title: 'Book 1', author: 'Author 1', price: 19.99 },
        { id: 4, title: 'Book 2', author: 'Author 2', price: 24.99 },
        // Add more products here
    ];

    return (
        <div className="col-span-1 md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductItem key={product.id} title={product.title} author={product.author} price={product.price} />
                ))}
            </div>
        </div>
    );
};
export default ProductList;