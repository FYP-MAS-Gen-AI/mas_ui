import React from 'react';

interface NavBarProps {
    selectedTab: string;
    onSelectTab: (tab: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({selectedTab, onSelectTab}) => {
    return (
        <div className="bg-gray-800 text-white flex p-4">
            {['Design', 'Edit', 'History'].map((tab) => (
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
