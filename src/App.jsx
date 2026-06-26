// src/App.jsx

import { useState } from 'react';
import Footer from './components/Footer';
import Specials from './components/Specials';
import Menu from './components/Menu';
import Header from './components/Header';
import Quiz from './components/Quiz';
import Join from './components/Join';
import Game from './components/Game';
import { useSheetData } from './hooks/useSheetData';
import { SHEET_URLS } from './config/sheets';

import './App.css';

const transformBeers = (rows) => rows.filter(b => b.name && b.name.trim() !== "");
const transformFood = (rows) => rows.filter(f => f.name && f.name.trim() !== "");

function App() {
  const [activeTab, setActiveTab] = useState('whats on');
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [menuCategory, setMenuCategory] = useState('beers');

  const {
    data: beers,
    isLoading: isBeersLoading,
    error: beersError,
  } = useSheetData(SHEET_URLS.beers, 'ramblers_beers_v1', transformBeers);

  const {
    data: food,
    isLoading: isFoodLoading,
    error: foodError,
  } = useSheetData(SHEET_URLS.food, 'ramblers_food_v1', transformFood);

  const isMenuLoading = isBeersLoading || isFoodLoading;

  const menuError =
    (beersError && beers.length === 0) || (foodError && food.length === 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'whats on':
        return <Specials setActiveTab={setActiveTab} beers={beers} setSelectedBeer={setSelectedBeer} />;
      case 'menu':
        if (menuError) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-20 gap-2">
              <p className="text-brand-org-1 font-black uppercase tracking-widest text-sm">
                Couldn't load the menu
              </p>
              <p className="text-gray-500 text-xs">
                Check your connection and try again shortly.
              </p>
            </div>
          );
        }
        return (
          <Menu
            beers={beers}
            food={food}
            isLoading={isMenuLoading}
            selectedBeer={selectedBeer}
            setSelectedBeer={setSelectedBeer}
            menuCategory={menuCategory}
          />
        );
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
      <Header activeTab={activeTab} menuCategory={menuCategory} setMenuCategory={setMenuCategory} />

      <main className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;