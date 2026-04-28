import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';

// Helper to turn "Monday" into 1, "Sunday" into 0 for the auto-scroll math
const dayMap = {
  'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
  'thursday': 4, 'friday': 5, 'saturday': 6
};

const Specials = ({ setActiveTab, beers = [], setSelectedBeer }) => {
  const scrollRef = useRef(null);
  const [specialsData, setSpecialsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const todayIndex = new Date().getDay(); 
  const featuredBeer = beers.find(b => b.is_featured === 'TRUE') || beers[0];

  useEffect(() => {
    const cachedSpecials = localStorage.getItem('ramblers_specials_cache');
    if (cachedSpecials) {
      setSpecialsData(JSON.parse(cachedSpecials));
      setIsLoading(false);
    }

    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTV2u2qZRaxVYdmuUljK4VG8ay4eECd6DFXB2fy0o0BIq65-XakEXTz7_GvxpCWpEctIW9FIiSVJ3l/pub?gid=1915634953&single=true&output=csv"; 

    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: (results) => {
        const validData = results.data
          .filter(row => row.Day && row.Title)
          .map(row => ({
            day: row.Day,
            title: row.Title,
            desc: row.Desc,
            dayId: dayMap[row.Day.toLowerCase().trim()] ?? 0
          }))
          .sort((a, b) => {
            const valA = a.dayId === 0 ? 7 : a.dayId; 
            const valB = b.dayId === 0 ? 7 : b.dayId;
            return valA - valB;
          });

        setSpecialsData(validData);
        setIsLoading(false);
        localStorage.setItem('ramblers_specials_cache', JSON.stringify(validData));
      },
      error: () => setIsLoading(false)
    });
  }, []);

  useEffect(() => {
    if (specialsData.length > 0 && scrollRef.current) {
      const timer = setTimeout(() => {
        const container = scrollRef.current;
        const arrayIndexOfToday = specialsData.findIndex(s => s.dayId === todayIndex);
        const cards = container.querySelectorAll('.snap-center');
        const todayCard = cards[arrayIndexOfToday];

        if (todayCard) {
          const scrollPos = todayCard.offsetLeft - (container.offsetWidth / 2) + (todayCard.offsetWidth / 2);
          container.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [specialsData, todayIndex]);

  const scrollCarousel = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.querySelector('.snap-center');
      const scrollAmount = card ? card.offsetWidth + 16 : 336; 
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const handleFeatureClick = () => {
    if (featuredBeer) {
      setSelectedBeer(featuredBeer);
      setActiveTab('menu');
    }
  };

  if (isLoading && specialsData.length === 0) {
    return <div className="flex justify-center pt-20 text-brand-org-1 animate-pulse font-bold tracking-widest text-xs uppercase">Loading Deals...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row landscape:flex-row h-full w-full bg-[#1a1a1a] overflow-hidden">
      
      {/* SECTION 1: Weekly Carousel */}
      {/* FIX: Set h-1/2 on portrait, switch to w-1/2 on landscape. This forces the 50/50 split. */}
      <div className="h-1/2 lg:h-full landscape:h-full w-full lg:w-1/2 landscape:w-1/2 flex flex-col justify-center relative border-b lg:border-b-0 landscape:border-b-0 lg:border-r landscape:border-r border-white/5 py-2 lg:py-0 landscape:py-0 shrink-0">   
        
        <div className="flex items-center justify-center gap-6 text-gray-500 mb-2 opacity-80 shrink-0">
          <button onClick={() => scrollCarousel('left')} className="p-3 -m-3 hover:text-brand-org-1 transition-colors cursor-pointer hidden sm:block">
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2">
            <ArrowLeft size={10} className="animate-pulse sm:hidden" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Weekly Specials</span>
            <ArrowRight size={10} className="animate-pulse sm:hidden" />
          </div>

          <button onClick={() => scrollCarousel('right')} className="p-3 -m-3 hover:text-brand-org-1 transition-colors cursor-pointer hidden sm:block">
            <ArrowRight size={16} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          // Changed pb-4 to pb-2 to fit perfectly in the top half
          className="flex overflow-x-auto snap-x snap-mandatory overscroll-contain px-[calc(50%-140px)] sm:px-[calc(50%-160px)] pb-2 pt-2 gap-4 [&::-webkit-scrollbar]:hidden shrink-0"
          style={{ scrollbarWidth: 'none' }} 
        >
          {specialsData.map((special) => {
            const isToday = special.dayId === todayIndex; 

            return (
              <div 
                key={special.day} 
                className={`
                  snap-center flex-shrink-0 w-[280px] sm:w-[320px] p-6 sm:p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center transition-all duration-500
                  ${isToday 
                    ? 'bg-[#222] border-2 border-brand-org-1 scale-100 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' 
                    : 'bg-[#111] border border-white/5 scale-90 opacity-40 hover:opacity-80'
                  }
                `}
              >
                {isToday && (
                  <span className="bg-brand-org-1 text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full mb-4 sm:mb-6 tracking-widest shadow-lg shadow-brand-org-1/20">
                    Happening Today
                  </span>
                )}
                <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-tighter mb-1 ${isToday ? 'text-white' : 'text-gray-500'}`}>
                  {special.day}
                </h3>
                <h4 className={`text-sm font-bold uppercase mb-4 ${isToday ? 'text-brand-org-1' : 'text-gray-600'}`}>
                  {special.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {special.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Featured Brew */}
      {/* Adjusted px-11 to px-6 on mobile to give the content more horizontal room */}
      <div className="h-1/2 lg:h-full landscape:h-full w-full lg:w-1/2 landscape:w-1/2 flex flex-col justify-center items-center px-12 py-4 lg:p-10 landscape:p-10 min-h-0 shrink-0">
        <div 
          onClick={handleFeatureClick}
          className="relative w-full h-full max-w-md bg-[#222] border border-white/5 rounded-[2.5rem] p-5 sm:p-8 flex items-center justify-between cursor-pointer active:scale-[0.97] hover:border-brand-org-1/40 transition-all overflow-hidden shadow-2xl group max-h-[220px] sm:max-h-[220px] lg:max-h-[320px] landscape:max-h-[320px]"
        >
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-brand-org-1 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>

          {/* Beer Image */}
          <div className="w-16 h-32 sm:w-20 sm:h-48 flex items-center justify-center flex-shrink-0 z-10 -mr-2 sm:-mr-4">
            {featuredBeer?.image_url ? (
              <img 
                src={featuredBeer.image_url} 
                alt={featuredBeer.name} 
                className="w-full h-full object-contain scale-150 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-[1.6] transition-transform duration-500" 
              />
            ) : (
              <div className="text-5xl animate-bounce">🍺</div>
            )}
          </div>

          {/* Info Column */}
          <div className="flex-1 pl-6 sm:pl-10 z-10 flex flex-col justify-center text-left min-w-0 py-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-org-1 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-org-1"></span>
              </span>
              <span className="text-[9px] sm:text-xs text-gray-500 font-black uppercase tracking-[0.2em] truncate">Featured Brew</span>
            </div>
            
            {/* TITLE: 
               1. Removed 'truncate'
               2. Added 'whitespace-normal' and 'line-clamp-2' to allow wrapping
               3. Used a conditional font size: if name is > 12 chars, it uses text-2xl instead of 3xl
            */}
            <h2 className={`
              ${(featuredBeer?.name?.length || 0) > 12 ? 'text-2xl' : 'text-3xl'} 
              sm:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-1.5 whitespace-normal line-clamp-2
            `}>
              {featuredBeer ? featuredBeer.name : 'Loading...'}
            </h2>
            
            <p className="text-brand-org-1 text-[10px] sm:text-sm font-black uppercase tracking-widest mb-2 truncate">
              Tap 4 · {featuredBeer?.style || 'Lager'}
            </p>
            
            <p className="text-gray-300 text-[11px] sm:text-sm leading-tight line-clamp-2 mb-3 italic">
              "{featuredBeer?.short_desc || 'A local favorite, perfect for any afternoon.'}"
            </p>
            
            <div className="flex items-center gap-2 text-white/60 text-[10px] sm:text-xs font-black uppercase tracking-widest group-hover:text-brand-org-1 transition-colors">
              <span>Tasting Notes</span>
              <ArrowRight size={14} className="text-brand-org-1 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specials;