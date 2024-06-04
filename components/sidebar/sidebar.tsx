import {
    FiChevronDown,
    FiDatabase,
    FiFile,
    FiFileText,
    FiHome,
    FiLink,
    FiMenu,
    FiSettings,
    FiUser,
    FiX
} from "react-icons/fi";
import React, {useState} from "react";
import Link from "next/link";

export function Sidebar({isSidebarOpen, setSidebarOpen}) {
    const [isDataSubmenuOpen, setDataSubmenuOpen] = useState(false);

    const toggleDataSubmenu = () => {
        setDataSubmenuOpen(!isDataSubmenuOpen);
    };

    return (
        <div
            className={`flex flex-col bg-white p-4 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} border-r border-gray-200 shadow-lg`}>
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-gray-800 text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>Dilmah</h1>
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="text-gray-800 focus:outline-none"
                >
                    {isSidebarOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
                </button>
            </div>
            <nav className="mt-10">
                <Link href="/dashboard/chat">
                    <div
                        className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 cursor-pointer">
                        <FiHome size={24}/>
                        {isSidebarOpen && <span className="ml-4 text-base font-medium">Chat</span>}
                    </div>
                </Link>
                <div>
                    <button
                        onClick={toggleDataSubmenu}
                        className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 w-full text-left cursor-pointer"
                    >
                        <FiDatabase size={24}/>
                        {isSidebarOpen && <span className="ml-4 text-base font-medium">Data</span>}
                        {isSidebarOpen && (
                            <span className={`ml-auto transition-transform ${isDataSubmenuOpen ? 'rotate-180' : ''}`}>
                                <FiChevronDown size={20}/>
                            </span>
                        )}
                    </button>
                    {isDataSubmenuOpen && isSidebarOpen && (
                        <div className="ml-8 mt-2">
                            <Link href="/dashboard/url">
                                <div
                                    className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 cursor-pointer">
                                    <FiLink size={20}/>
                                    <span className="ml-4 text-base font-medium">URL</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/file">
                                <div
                                    className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 cursor-pointer">
                                    <FiFile size={20}/>
                                    <span className="ml-4 text-base font-medium">File</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/text">
                                <div
                                    className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 cursor-pointer">
                                    <FiFileText size={20}/>
                                    <span className="ml-4 text-base font-medium">Text</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
                <Link href="#">
                    <div
                        className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 cursor-pointer">
                        <FiUser size={24}/>
                        {isSidebarOpen && <span className="ml-4 text-base font-medium">Profile</span>}
                    </div>
                </Link>
                <Link href="#">
                    <div
                        className="flex items-center text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 cursor-pointer">
                        <FiSettings size={24}/>
                        {isSidebarOpen && <span className="ml-4 text-base font-medium">Settings</span>}
                    </div>
                </Link>
            </nav>
        </div>
    );
}
