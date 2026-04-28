import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { createPortal } from 'react-dom'; // 1. Import createPortal

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

const Menu = ({ beers, isLoading, selectedBeer, setSelectedBeer }) => {
  const [showFilters, setShowFilters] = useState(false);
  
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
            ? 'bg-brand-org-1 border-brand-org-1 text-black shadow-[0_0_15px_rgba(243,147,27,0.4)]' 
            : 'bg-[#222] border-gray-700 text-gray-400'
          }`}
        >
          {showFilters ? 'Hide Filters' : 'Find My Beer'}
          <SlidersHorizontal size={16} />
        </button>
      </header>

      {/* INSTANT TASTE SLIDERS PANEL */}
      {showFilters && (
        <div className="px-4 mb-2">
          <div className="bg-[#222] p-4 rounded-2xl border border-brand-org-1/30 flex flex-col gap-3">
            {Object.keys(sliders).map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  <span>{key}</span>
                  <span className="text-brand-org-1">{sliders[key]}</span>
                </div>
                <div className="py-1 flex items-center justify-center">
                  <input 
                    type="range" min="0" max="5" 
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
                      [&::-webkit-slider-thumb]:bg-brand-org-1
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
                      [&::-moz-range-thumb]:bg-brand-org-1
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

      {/* BEER LIST */}
      <div className="grid gap-3 px-4 text-left">
        {isLoading ? (
          <div className="text-center text-brand-org-1 py-10 uppercase tracking-widest animate-pulse font-bold">Tapping Kegs...</div>
        ) : (
          displayedBeers.map((beer) => (
            <div 
              key={beer.name} 
              onClick={() => setSelectedBeer(beer)}
              className="bg-[#222] border-l-4 border-brand-org-1 p-4 rounded-r-xl flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer gap-2"
            >
              <div className="flex-1 flex flex-col gap-1 pr-2">
                <h2 className="text-white font-bold text-lg uppercase leading-tight">{beer.name}</h2>
                <div className="flex gap-2 items-center">
                  <span className="text-brand-org-1 text-[10px] font-black uppercase tracking-wider">{beer.style}</span>
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
                    <div className="text-brand-org-1 font-mono font-bold leading-none text-lg">
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

      {/* BEER DETAIL OVERLAY - TELEPORTED TO BODY */}
      {createPortal(
        <AnimatePresence>
          {selectedBeer && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              /* Pushed the z-index to 9999 to guarantee it sits above absolutely everything */
              className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col text-left overscroll-none"
            >
              <div className="flex justify-end pt-[calc(env(safe-area-inset-top)+1rem)] px-6 shrink-0">
                <button 
                  onClick={() => setSelectedBeer(null)} 
                  className="p-3 -m-3 text-gray-500 hover:text-white active:scale-90 transition-all"
                >
                  <X size={28} />
                </button>
              </div>
              
              {/* Added webkit-overflow-scrolling to force smooth native scrolling instantly on iOS */}
              <div className="flex-1 overflow-y-auto px-6 pb-32 [-webkit-overflow-scrolling:touch]">
                <div className="flex flex-col items-center gap-8 mt-4">
                  
                  <div className="w-56 h-56 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex-shrink-0">
                    <img src={selectedBeer.image_url} alt={selectedBeer.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="w-full">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-2">
                          {selectedBeer.name}
                        </h1>
                        <p className="text-brand-org-1 font-black uppercase tracking-widest text-sm">
                          {selectedBeer.style} · {selectedBeer.abv}
                        </p>
                      </div>
                      <div className="bg-[#222] border border-white/5 px-4 py-2 rounded-2xl text-center shadow-xl shrink-0">
                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Tap</div>
                        <div className="text-white font-mono font-black text-2xl leading-none mt-1">
                          {selectedBeer.tap_number}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-8">
                      {[selectedBeer.note1, selectedBeer.note2, selectedBeer.note3, selectedBeer.note4].map(note => (
                        note && (
                          <span 
                            key={note} 
                            className="bg-[#222] text-gray-300 text-[10px] px-4 py-1.5 rounded-full uppercase font-black border border-white/5 tracking-wider"
                          >
                            {note}
                          </span>
                        )
                      ))}
                    </div>

                    <div className="mt-10 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-8 italic">
                      {selectedBeer.long_desc}
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4">
                      {['bit', 'hop', 'malt', 'booz'].map(stat => (
                        <div key={stat} className="bg-[#222] p-4 rounded-2xl border border-white/5 shadow-inner">
                          <div className="text-[10px] uppercase font-black text-gray-500 mb-3 tracking-widest">
                            {stat === 'bit' ? 'Bitterness' : stat === 'hop' ? 'Hoppiness' : stat === 'malt' ? 'Maltiness' : 'Strength'}
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(tick => (
                              <div 
                                key={tick} 
                                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                                  tick <= parseInt(selectedBeer[stat]) ? 'bg-brand-org-1 shadow-[0_0_8px_rgba(243,147,27,0.4)]' : 'bg-gray-800'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Menu;