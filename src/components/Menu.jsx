import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

function computeMatchScore(userPrefs, beerChars) {
  const keys = Object.keys(userPrefs);
  let totalDiff = 0;
  keys.forEach(key => {
    const sheetKey = key === 'bitterness' ? 'bit' : 
                     key === 'hoppiness' ? 'hop' : 
                     key === 'maltiness' ? 'malt' : 'booz';
    
    const beerVal = parseInt(beerChars[sheetKey]) || 0;
    totalDiff += Math.abs(userPrefs[key] - beerVal);
  });
  const maxDiff = keys.length * 4; 
  return 1 - totalDiff / maxDiff;
}

const Menu = ({ beers, isLoading }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [sliders, setSliders] = useState({
    bitterness: 3,
    hoppiness: 3,
    maltiness: 3,
    booziness: 3,
  });

  const displayedBeers = useMemo(() => {
    if (!beers.length) return [];
    
    const scoredBeers = beers.map((beer) => ({
      ...beer,
      matchScore: computeMatchScore(sliders, beer),
    }));

    if (showFilters) {
      return scoredBeers.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      return scoredBeers.sort((a, b) => parseInt(a.tap_number) - parseInt(b.tap_number));
    }
  }, [beers, sliders, showFilters]);

  return (
    <div className="flex flex-col gap-6 pb-32">
      
      {/* MINIMAL HEADER */}
      <header className="pt-8 px-4 flex justify-end">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border flex gap-2 items-center font-bold text-xs uppercase tracking-widest transition-all ${
            showFilters 
            ? 'bg-[#F3931B] border-[#F3931B] text-black shadow-[0_0_15px_rgba(243,147,27,0.4)]' 
            : 'bg-[#222] border-gray-700 text-gray-400'
          }`}
        >
          {showFilters ? 'Hide Filters' : 'Find My Beer'}
          <SlidersHorizontal size={16} />
        </button>
      </header>

      {/* INSTANT TASTE SLIDERS PANEL - NO ANIMATION */}
      {showFilters && (
        <div className="px-4 mb-2">
          <div className="bg-[#222] p-4 rounded-2xl border border-[#F3931B]/30 flex flex-col gap-3">
            {Object.keys(sliders).map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  <span>{key}</span>
                  <span className="text-[#F3931B]">{sliders[key]}</span>
                </div>
                <div className="py-1 flex items-center justify-center">
                  <input 
                    type="range" min="1" max="5" 
                    value={sliders[key]} 
                    onChange={(e) => setSliders({...sliders, [key]: parseInt(e.target.value)})}
                    className="
                      w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer outline-none shadow-none
                      
                      /* Webkit (iPhone/Safari/Chrome) */
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:box-content
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-[#F3931B]
                      [&::-webkit-slider-thumb]:border-[14px]
                      [&::-webkit-slider-thumb]:border-solid
                      [&::-webkit-slider-thumb]:border-transparent
                      [&::-webkit-slider-thumb]:bg-clip-padding

                      /* Mozilla (Firefox/PC) */
                      [&::-moz-range-thumb]:appearance-none 
                      [&::-moz-range-thumb]:box-content
                      [&::-moz-range-thumb]:w-3
                      [&::-moz-range-thumb]:h-3
                      [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-[#F3931B]
                      [&::-moz-range-thumb]:border-[14px]
                      [&::-moz-range-thumb]:border-solid
                      [&::-moz-range-thumb]:border-transparent
                      [&::-moz-range-thumb]:bg-clip-padding
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 px-4 text-left">
        {isLoading ? (
          <div className="text-center text-[#F3931B] py-10 uppercase tracking-widest animate-pulse font-bold">Tapping Kegs...</div>
        ) : (
          displayedBeers.map((beer) => (
            <div 
              key={beer.name} 
              onClick={() => setSelectedBeer(beer)}
              className="bg-[#222] border-l-4 border-[#F3931B] p-4 rounded-r-xl flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer gap-2"
            >
              <div className="flex-1 flex flex-col gap-1 pr-2">
                <h2 className="text-white font-bold text-lg uppercase leading-tight">{beer.name}</h2>
                <div className="flex gap-2 items-center">
                  <span className="text-[#F3931B] text-[10px] font-black uppercase tracking-wider">{beer.style}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="text-gray-400 font-mono text-[10px]">{beer.abv}</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-snug mt-1 line-clamp-2">{beer.short_desc}</p>
              </div>
              
              <div className="w-16 h-24 flex-shrink-0 flex items-center justify-center -my-2">
                <img src={beer.image_url} alt="" className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              <div className="text-right flex flex-col items-end justify-center min-w-[50px] pl-2 border-l border-gray-800">
                {showFilters ? (
                  <>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Match</div>
                    <div className="text-[#F3931B] font-mono font-bold leading-none text-lg">
                      {Math.round(beer.matchScore * 100)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Tap</div>
                    <div className="text-white font-mono font-bold leading-none text-2xl">
                      {beer.tap_number}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* BEER DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedBeer && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            /* Removed p-6 from this outer container and changed from fixed to absolute */
            className="absolute inset-0 z-[2000] bg-[#1a1a1a] flex flex-col text-left"
          >
            {/* Top Bar for Close Button (Padding moved here) */}
            <div className="flex justify-end pt-6 px-6">
              <button onClick={() => setSelectedBeer(null)} className="p-2 text-gray-400 active:text-white"><X /></button>
            </div>
            
            {/* Scrollable Content Area (Padding moved inside so scrollbar hugs the edge) */}
            <div className="flex flex-col items-center gap-6 mt-2 overflow-y-auto px-6 pb-24">
              <div className="w-48 h-48 drop-shadow-2xl flex-shrink-0">
                <img src={selectedBeer.image_url} alt="" className="w-full h-full object-contain" />
              </div>
              
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{selectedBeer.name}</h1>
                    <p className="text-[#F3931B] font-bold uppercase tracking-widest mt-1">{selectedBeer.style} · {selectedBeer.abv}</p>
                  </div>
                  <div className="bg-[#222] border border-gray-700 px-3 py-2 rounded-xl text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Tap</div>
                    <div className="text-white font-mono font-black text-xl">{selectedBeer.tap_number}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {[selectedBeer.note1, selectedBeer.note2, selectedBeer.note3, selectedBeer.note4].map(note => (
                    note && <span key={note} className="bg-[#222] text-gray-300 text-[10px] px-3 py-1 rounded-full uppercase font-bold border border-gray-700">{note}</span>
                  ))}
                </div>

                <div className="mt-8 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-6">
                  {selectedBeer.long_desc}
                </div>

                {/* Flavor Profile Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {['bit', 'hop', 'malt', 'booz'].map(stat => (
                    <div key={stat} className="bg-[#222] p-3 rounded-xl border border-gray-800">
                      <div className="text-[9px] uppercase font-black text-gray-500 mb-2 tracking-tighter">
                        {stat === 'bit' ? 'Bitter' : stat === 'hop' ? 'Hoppy' : stat === 'malt' ? 'Malty' : 'Booz'}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(tick => (
                          <div key={tick} className={`h-1 flex-1 rounded-full ${tick <= selectedBeer[stat] ? 'bg-[#F3931B]' : 'bg-gray-700'}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;