// src/App.jsx
import { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import Footer from './components/Footer';
import Specials from './components/Specials';
import Menu from './components/Menu';
import Header from './components/Header';
import Quiz from './components/Quiz';
import Join from './components/Join';
import Game from './components/Game';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('whats on');
  const [beers, setBeers] = useState([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [selectedBeer, setSelectedBeer] = useState(null);

  useEffect(() => {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTV2u2qZRaxVYdmuUljK4VG8ay4eECd6DFXB2fy0o0BIq65-XakEXTz7_GvxpCWpEctIW9FIiSVJ3l/pub?gid=0&single=true&output=csv";
    
    const cachedBeers = localStorage.getItem('ramblers_beer_cache');
    if (cachedBeers) {
      setBeers(JSON.parse(cachedBeers));
      setIsMenuLoading(false);
    }

    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: (results) => {
        const validBeers = results.data.filter(beer => beer.name && beer.name.trim() !== "");
        setBeers(validBeers); 
        setIsMenuLoading(false); 
        localStorage.setItem('ramblers_beer_cache', JSON.stringify(validBeers));
      },
      error: (error) => {
        console.error("Error fetching tap list:", error);
        if (!cachedBeers) setIsMenuLoading(false); 
      }
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'whats on': 
        return <Specials setActiveTab={setActiveTab} beers={beers} setSelectedBeer={setSelectedBeer} />;
      case 'menu':     
        return <Menu beers={beers} isLoading={isMenuLoading} selectedBeer={selectedBeer} setSelectedBeer={setSelectedBeer} />; 
      case 'game':     
        return <Game />; 
      case 'quiz':     
        return <Quiz />; 
      case 'join':     
        return <Join />; 
      default:         
        return <Specials setActiveTab={setActiveTab} beers={beers} setSelectedBeer={setSelectedBeer} />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* The content-wrapper keeps things centered on larger screens */}
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;