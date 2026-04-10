import { useState } from 'react';
import Footer from './components/Footer';
import Specials from './components/Specials'; // <--- Import the new brick
import Menu from './components/Menu'; // <--- Import the new brick
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('specials');

  const renderContent = () => {
    switch (activeTab) {
      case 'specials': 
        return <Specials/>; // <--- Use the component here
      case 'menu':     
        return <Menu/>; // <--- Use the component here
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
      <main className="main-content">
        {renderContent()}
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;