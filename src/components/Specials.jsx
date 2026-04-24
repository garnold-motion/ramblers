import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const specialsData = [
  { dayId: 1, day: 'Monday', title: '$18 Curry Night', desc: 'House-made curry to kick off the week.' },
  { dayId: 2, day: 'Tuesday', title: 'Tight Arse Tuesday', desc: '$15 Bowls All Night.' },
  { dayId: 3, day: 'Wednesday', title: 'Trivia Night', desc: '$200 in prizes. From 7pm, bookings essential.' },
  { dayId: 4, day: 'Thursday', title: 'Burger Night', desc: '$20 Burger & Pot combos.' },
  { dayId: 5, day: 'Friday', title: 'Happy Hour', desc: '$10 Selected Pints from 4pm – 7pm.' },
  { dayId: 6, day: 'Saturday', title: 'Saturday Steal', desc: '$10 Pints All Day.' },
  { dayId: 0, day: 'Sunday', title: 'Sunday Roast', desc: 'Hearty Roast of the Day with a Pot of Beer or Wine.' },
];

const Specials = ({ setActiveTab, beers = [], setSelectedBeer }) => {
  const scrollRef = useRef(null);
  const todayIndex = new Date().getDay(); 
  const featuredBeer = beers.find(b => parseInt(b.tap_number) === 4);

  useEffect(() => {
    // 150ms timeout gives the DOM time to render before calculating the slide
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const arrayIndexOfToday = specialsData.findIndex(s => s.dayId === todayIndex);
        
        const cards = container.querySelectorAll('.snap-center');
        const todayCard = cards[arrayIndexOfToday];

        if (todayCard) {
          // Exact coordinate math to find the center
          const scrollPos = todayCard.offsetLeft - (container.offsetWidth / 2) + (todayCard.offsetWidth / 2);
          
          container.scrollTo({
            left: scrollPos,
            behavior: 'smooth' // THE SLIDE IS BACK!
          });
        }
      }
    }, 150); 

    return () => clearTimeout(timer);
  }, [todayIndex, beers]); 

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

  return (
    <div className="flex flex-col landscape:flex-row h-full w-full bg-[#1a1a1a] overflow-hidden">
      
      {/* SECTION 1: Weekly Carousel */}
      <div className="flex-1 flex flex-col justify-center w-full landscape:w-1/2 relative border-b landscape:border-b-0 landscape:border-r border-white/5 py-4 landscape:py-0">   
        
        <div className="flex items-center justify-center gap-6 text-gray-500 mb-2 sm:mb-4 opacity-80 shrink-0">
          <button 
            onClick={() => scrollCarousel('left')}
            className="p-3 -m-3 hover:text-[#F3931B] transition-colors cursor-pointer hidden sm:block"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2">
            <ArrowLeft size={10} className="animate-pulse sm:hidden" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Weekly Specials</span>
            <ArrowRight size={10} className="animate-pulse sm:hidden" />
          </div>

          <button 
            onClick={() => scrollCarousel('right')}
            className="p-3 -m-3 hover:text-[#F3931B] transition-colors cursor-pointer hidden sm:block"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory overscroll-contain px-[calc(50%-140px)] sm:px-[calc(50%-160px)] pb-4 pt-2 gap-4 [&::-webkit-scrollbar]:hidden shrink-0"
          style={{ scrollbarWidth: 'none' }} 
        >
          {specialsData.map((special) => {
            const isToday = special.dayId === todayIndex; 

            return (
              <div 
                key={special.dayId} 
                className={`
                  snap-center flex-shrink-0 w-[280px] sm:w-[320px] p-6 sm:p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center transition-all duration-500
                  ${isToday 
                    ? 'bg-[#222] border-2 border-[#F3931B] shadow-[0_20px_50px_rgba(0,0,0,0.4)] scale-100 opacity-100' 
                    : 'bg-[#111] border border-white/5 scale-90 opacity-40 hover:opacity-80'
                  }
                `}
              >
                {isToday && (
                  <span className="bg-[#F3931B] text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full mb-4 sm:mb-6 tracking-widest shadow-lg shadow-[#F3931B]/20">
                    Happening Today
                  </span>
                )}
                <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-tighter mb-1 ${isToday ? 'text-white' : 'text-gray-500'}`}>
                  {special.day}
                </h3>
                <h4 className={`text-sm font-bold uppercase mb-4 ${isToday ? 'text-[#F3931B]' : 'text-gray-600'}`}>
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
      <div className="flex-1 flex flex-col justify-center items-center w-full landscape:w-1/2 p-6 landscape:p-10">
        
        <div 
          onClick={handleFeatureClick}
          className="relative w-full max-w-md bg-[#222] border border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex items-center justify-between cursor-pointer active:scale-[0.97] hover:border-[#F3931B]/40 transition-all overflow-hidden shadow-2xl group max-h-[220px] landscape:max-h-[320px] landscape:h-full"
        >
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#F3931B] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>

          <div className="w-16 h-24 sm:w-24 sm:h-40 flex items-center justify-center flex-shrink-0 z-10">
            {featuredBeer?.image_url ? (
              <img src={featuredBeer.image_url} alt={featuredBeer.name} className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="text-6xl animate-bounce">🍺</div>
            )}
          </div>

          <div className="flex-1 pl-6 sm:pl-8 z-10 flex flex-col justify-center text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3931B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3931B]"></span>
              </span>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Featured Brew</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-1">
              {featuredBeer ? featuredBeer.name : 'Loading...'}
            </h2>
            <p className="text-[#F3931B] text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3">
              Tap 4 · {featuredBeer?.style || 'Lager'}
            </p>
            
            <p className="text-gray-400 text-[10px] sm:text-[11px] leading-snug line-clamp-2 mb-4 italic">
              "{featuredBeer?.short_desc || 'A local favorite, perfect for any afternoon.'}"
            </p>
            
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest group-hover:text-[#F3931B] transition-colors">
              <span>Tasting Notes</span>
              <ArrowRight size={14} className="text-[#F3931B] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Specials;