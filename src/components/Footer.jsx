// src/components/Footer.jsx
import { Calendar, Beer, Trophy, Gamepad2, UserPlus, BeerIcon, BeerOff } from 'lucide-react';

const Footer = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { label: 'Whats On', icon: Calendar, key: 'whats on' },
    { label: 'Menu', icon: Beer, key: 'menu' },
    { label: 'Quiz', icon: Trophy, key: 'quiz' },
    { label: 'Game', icon: Gamepad2, key: 'game' },
    { label: 'Join', icon: UserPlus, key: 'join' }
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#222]/95 backdrop-blur-md border-t border-white/5 z-[1000] pb-[env(safe-area-inset-bottom)]">
      {/* This container ensures the footer content looks good on Tablets/Desktops */}
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button 
              key={tab.key} 
              onClick={() => setActiveTab(tab.key)} 
              className={`
                flex-1 h-full flex flex-col items-center justify-center gap-1
                bg-transparent border-none p-0 cursor-pointer
                transition-all duration-200
                [-webkit-tap-highlight-color:transparent]
                ${isActive ? 'text-[#F3931B]' : 'text-gray-500'}
                active:scale-90
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-extrabold uppercase tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;