import React from 'react';
function Header() {
    return (
        <div className="container mx-auto mt-6 max-w-screen">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                    <img
                        src="src\assest\thumbnail.png"
                        alt="Banner"
                        className="w-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                        <button className="bg-gray-900 bg-opacity-50 text-white rounded-full p-2">
                            ‹
                        </button>
                        <button className="bg-gray-900 bg-opacity-50 text-white rounded-full p-2">
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Header;