import React from 'react';
import Link from 'next/link'; // Import Link for navigation

interface NavBarProps {
    selectedTab: string;
    onSelectTab: (tab: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedTab, onSelectTab }) => {
    return (
        <div className="bg-gray-800 text-white flex p-4 fixed w-full z-40 items-center">
            <Link href='/' className='flex items-center mr-4'>
                <img src="/mas_logo.png" alt="MAS Logo" className="w-8 h-8 ml-1"/>
            </Link>
            <Link href='/create' className='flex items-center mr-4'>
                <span className="text-xl">&lt;</span> {/* Back arrow symbol */}
                <span className="ml-1">Back</span>
            </Link>
            <span className="text-white mr-4">|</span>
            {['Design', 'Edit', 'History', 'Chatbot'].map((tab) => (
                <button
                    key={tab}
                    className={`mr-4 ${selectedTab === tab ? 'font-bold' : ''}`}
                    onClick={() => onSelectTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default NavBar;
