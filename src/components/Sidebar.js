import React from "react";
function Sidebar() {
    return (
        <aside className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500">
                        Fiction
                    </a>
                </li>
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500">
                        Non-fiction
                    </a>
                </li>
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500">
                        Mystery
                    </a>
                </li>
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500">
                        Romance
                    </a>
                </li>
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500">
                        Sci-fi
                    </a>
                </li>
            </ul>
        </aside>
    )
}
export default Sidebar;