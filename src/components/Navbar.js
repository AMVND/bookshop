import React, { useState } from 'react';
const Navbar = ({ isLoggedIn, onLogin }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4">
                <div className="text-2xl font-bold text-red-500">BookShop</div>
                <div className="flex space-x-4">
                    <input type="text" placeholder="Search for books..." className="border border-gray-300 rounded-lg px-4 py-2 w-80" />
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Search</button>
                </div>
                <div className="flex items-center space-x-6">
                    {isLoggedIn ? (
                        <>
                            <span className="text-gray-600">Welcome, {isLoggedIn}</span>
                            <a href="#" className="text-gray-600">Cart</a>
                        </>
                    ) : (
                        <a href="#" className="text-gray-600" onClick={onLogin}>Login</a>
                    )}
                </div>
            </div>
        </header>
    );
}
export default Navbar;
