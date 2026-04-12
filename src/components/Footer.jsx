const Footer = ({ activeTab, setActiveTab }) => {
  const tabs = ['Specials', 'Menu', 'Quiz', 'Game', 'Join'];

  return (
    <footer className="absolute bottom-0 left-0 w-full h-[60px] pb-[env(safe-area-inset-bottom)] box-content flex justify-around items-center bg-[#222] border-t border-[#444] z-[1000]">
      {tabs.map((tab) => {
        const tabKey = tab.toLowerCase();
        const isActive = activeTab === tabKey;

        return (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tabKey)} 
            className={`
              flex-1 h-full flex flex-col items-center justify-center
              bg-transparent border-none p-0 cursor-pointer
              text-[11px] font-bold uppercase transition-colors duration-100
              [-webkit-tap-highlight-color:transparent]
              ${isActive ? 'text-[#F3931B]' : 'text-[#888]'}
              active:text-[#F3931B]
            `}
          >
            {tab}
          </button>
        );
      })}
    </footer>
  );
};

export default Footer;