// src/components/Header.jsx
import React from 'react';

const Header = ({ activeTab, menuCategory, setMenuCategory }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-[#222]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-screen-xl mx-auto h-16 flex items-center w-full">
        
        {activeTab === 'menu' ? (
          /* Split perfectly into thirds, filling the entire header height */
          <div className="flex w-full h-full">
            {['beers', 'wine', 'food'].map((category) => (
              <button
                key={category}
                onClick={() => setMenuCategory(category)}
                className={`flex-1 h-full flex items-center justify-center text-sm font-black uppercase tracking-widest transition-colors ${
                  menuCategory === category
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <h1 className="text-brand-org-1 font-black tracking-[4px] text-sm sm:text-base md:text-lg">
              RAMBLERS ALE WORKS
            </h1>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;