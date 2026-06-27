import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, MoveHorizontal } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_URLS } from '../config/sheets';
import { transformWine } from '../data/transforms';

// Preferred display order for food categories; anything else gets appended at the end
const FOOD_CATEGORY_ORDER = ['Burgers', 'Bowls', 'Loaded Fries', 'Sides', 'Share Plates', 'Mains', 'Kids'];

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

const filterOptions = [
  { label: 'LOW', value: 1 },
  { label: 'MED', value: 3 },
  { label: 'HIGH', value: 5 }
];

const CategoryPills = ({ categories, active, onSelect }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [categories]);

  return (
    <div className="w-full flex flex-col items-center gap-1.5">
      <MoveHorizontal size={12} className="text-gray-600" />
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                active === cat
                  ? 'bg-brand-org-1 text-black'
                  : 'bg-[#222] text-gray-400 border border-white/10 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1a1a1a] to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1a1a1a] to-transparent" />
        )}
      </div>
    </div>
  );
};

const Menu = ({ beers, food = [], isLoading, selectedBeer, setSelectedBeer, menuCategory }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFoodCategory, setActiveFoodCategory] = useState('All');
  const [activeWineStyle, setActiveWineStyle] = useState('All');

  const [sliders, setSliders] = useState({
    bitterness: 3,
    hoppiness: 3,
    maltiness: 3,
    booziness: 3,
  });

  const { data: wineList, isLoading: isWineLoading } = useSheetData(
    SHEET_URLS.wine,
    'ramblers_wine_v1',
    transformWine
  );

  const displayedBeers = useMemo(() => {
    if (!beers.length) return [];
    const activeBeers = beers.filter(beer => beer.on_tap?.toUpperCase() === 'TRUE');
    const scoredBeers = activeBeers.map((beer) => ({
      ...beer,
      matchScore: computeMatchScore(sliders, beer),
    }));
    return showFilters
      ? scoredBeers.sort((a, b) => b.matchScore - a.matchScore)
      : scoredBeers.sort((a, b) => parseInt(a.tap_number) - parseInt(b.tap_number));
  }, [beers, sliders, showFilters]);

  const foodByCategory = useMemo(() => {
    const available = food.filter(item => item.is_available?.toUpperCase() === 'TRUE');
    const grouped = {};
    available.forEach(item => {
      const cat = item.category?.trim() || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    const ordered = [];
    FOOD_CATEGORY_ORDER.forEach(cat => {
      if (grouped[cat]) {
        ordered.push([cat, grouped[cat]]);
        delete grouped[cat];
      }
    });
    Object.keys(grouped).forEach(cat => ordered.push([cat, grouped[cat]]));

    return ordered;
  }, [food]);

  const foodCategories = useMemo(
    () => ['All', ...foodByCategory.map(([cat]) => cat)],
    [foodByCategory]
  );

  const displayedFoodCategories = useMemo(
    () => activeFoodCategory === 'All'
      ? foodByCategory
      : foodByCategory.filter(([cat]) => cat === activeFoodCategory),
    [foodByCategory, activeFoodCategory]
  );

  const wineStyles = useMemo(
    () => ['All', ...new Set(wineList.map(w => w.style).filter(Boolean))],
    [wineList]
  );

  const displayedWines = useMemo(
    () => activeWineStyle === 'All'
      ? wineList
      : wineList.filter(w => w.style === activeWineStyle),
    [wineList, activeWineStyle]
  );

  return (
    <div className="flex flex-col gap-6 pb-32">

      <header className="pt-8 px-4 flex justify-center min-h-[72px]">
        {menuCategory === 'beers' && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative px-8 py-3 rounded-full flex gap-3 items-center font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${
              showFilters
              ? 'bg-brand-org-1 border border-brand-org-1 text-black shadow-[0_0_30px_rgba(243,147,27,0.5)] scale-105'
              : 'bg-[#111] border border-brand-org-1/40 text-brand-org-1 shadow-[0_0_15px_rgba(243,147,27,0.15)] hover:shadow-[0_0_25px_rgba(243,147,27,0.3)] hover:bg-[#1a1a1a]'
            }`}
          >
            <span>{showFilters ? 'Hide Filters' : 'Find My Beer'}</span>
            <SlidersHorizontal size={18} />
          </button>
        )}

        {menuCategory === 'food' && (
          <CategoryPills categories={foodCategories} active={activeFoodCategory} onSelect={setActiveFoodCategory} />
        )}

        {menuCategory === 'wine' && (
          <CategoryPills categories={wineStyles} active={activeWineStyle} onSelect={setActiveWineStyle} />
        )}
      </header>

      {showFilters && menuCategory === 'beers' && (
        <div className="px-4 mb-2">
          <div className="bg-[#222] p-3 sm:p-4 rounded-2xl border border-brand-org-1/30 flex flex-col gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {Object.keys(sliders).map((key) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-gray-400 w-20 shrink-0">
                  {key}
                </div>
                <div className="flex bg-[#111] p-1 rounded-lg border border-white/10 flex-1 shadow-inner">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSliders({...sliders, [key]: opt.value})}
                      className={`flex-1 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                        sliders[key] === opt.value
                          ? 'bg-brand-org-1 text-black shadow-sm scale-[1.02]'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 px-4 text-left">

        {menuCategory === 'beers' && (
          isLoading ? (
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
          )
        )}

        {menuCategory === 'wine' && (
          isWineLoading ? (
            <div className="text-center text-brand-org-1 py-10 uppercase tracking-widest animate-pulse font-bold">Uncorking...</div>
          ) : (
            displayedWines.map((wine) => (
              <div
                key={wine.name}
                className="bg-[#222] border-l-4 border-brand-org-1 p-4 rounded-r-xl flex items-center justify-between gap-3"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="text-white font-bold text-lg uppercase leading-tight">{wine.name}</h2>
                  <div className="flex gap-2 items-center">
                    <span className="text-brand-org-1 text-[10px] font-black uppercase tracking-wider">{wine.style}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-gray-400 font-mono text-[10px]">{wine.abv}</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-snug mt-1 line-clamp-2 italic">"{wine.description}"</p>
                </div>

                <div className="text-right flex flex-col items-end justify-center min-w-[50px] pl-2 border-l border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-black">Glass</div>
                  <div className="text-white font-mono font-bold leading-none text-2xl">${wine.price}</div>
                </div>
              </div>
            ))
          )
        )}

        {menuCategory === 'food' && (
          isLoading ? (
            <div className="text-center text-brand-org-1 py-10 uppercase tracking-widest animate-pulse font-bold">Firing The Grill...</div>
          ) : (
            displayedFoodCategories.map(([category, items]) => (
              <div key={category} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mt-4 first:mt-0">
                  <h3 className="text-brand-org-1 font-black uppercase tracking-[0.2em] text-xs whitespace-nowrap">
                    {category}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-brand-org-1/40 to-transparent" />
                </div>

                {items.map((item, idx) => (
                  <div
                    key={`${category}-${item.name}-${idx}`}
                    className="bg-[#222] border-l-4 border-brand-org-1 p-4 rounded-r-xl flex justify-between gap-3 items-stretch"
                  >
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-white font-bold text-base sm:text-lg uppercase leading-tight">{item.name}</h2>
                        {item.dietary?.trim() && (
                          <span className="text-[9px] bg-brand-org-1/10 text-brand-org-1 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-brand-org-1/20">
                            {item.dietary}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-[11px] leading-snug">{item.description}</p>
                    </div>

                    <div className="shrink-0 pl-3 border-l border-gray-800 flex flex-col items-end justify-center min-w-[56px]">
                      <div className="text-brand-org-1 font-mono font-bold text-xl leading-none">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )
        )}

      </div>

      {createPortal(
        <AnimatePresence>
          {selectedBeer && menuCategory === 'beers' && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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