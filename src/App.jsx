import { useState, useEffect } from 'react';
import Papa from 'papaparse'; // 1. Import Papa here now
import Footer from './components/Footer';
import Specials from './components/Specials';
import Menu from './components/Menu';
import Header from './components/Header';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('specials');
  
  const [beers, setBeers] = useState([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  useEffect(() => {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTV2u2qZRaxVYdmuUljK4VG8ay4eECd6DFXB2fy0o0BIq65-XakEXTz7_GvxpCWpEctIW9FIiSVJ3l/pub?gid=0&single=true&output=csv";
    
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: (results) => {
        const validBeers = results.data.filter(beer => beer.name && beer.name.trim() !== "");
        setBeers(validBeers);
        setIsMenuLoading(false);
      },
      error: (error) => {
        console.error("Error fetching tap list:", error);
        setIsMenuLoading(false);
      }
    });
  }, []);
  // ----------------------------

  const renderContent = () => {
    switch (activeTab) {
      case 'specials': 
        return <Specials/>;
      case 'menu':     
        return <Menu beers={beers} isLoading={isMenuLoading} />; 
      case 'game':     
        return <div><h1>Pint Pourer</h1><p>Rive Game incoming.</p></div>;
      case 'quiz':     
        return <div><h1>Beer Quiz</h1><p>Test your knowledge.</p></div>;
      case 'join':     
        return <div><h1>Join the Crew</h1><p>Sign up here.</p></div>;
      default:         
        return <Specials/>;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;