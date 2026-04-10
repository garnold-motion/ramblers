const Footer = ({ activeTab, setActiveTab }) => {
  const tabs = ['Specials', 'Menu', 'Quiz', 'Game', 'Join'];

  return (
    <footer className="footer">
      {tabs.map((tab) => {
        const tabKey = tab.toLowerCase();
        const isActive = activeTab === tabKey;

        return (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tabKey)} 
            className={`footer-button ${isActive ? 'active' : ''}`}
          >
            {tab}
          </button>
        );
      })}
    </footer>
  );
};

export default Footer;