import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const specialsData = [
  { id: 0, day: 'Sunday', title: 'Sunday Roast', desc: 'Hearty Roast of the Day with a Pot of Beer or Wine.' },
  { id: 1, day: 'Monday', title: '$18 Curry Night', desc: 'Delicious house-made curry to kick off the week.' },
  { id: 2, day: 'Tuesday', title: 'Tight Arse Tuesday', desc: '$15 Bowls All Night.' },
  { id: 3, day: 'Wednesday', title: 'Trivia Night', desc: '$200 in prizes. From 7pm, bookings essential.' },
  { id: 4, day: 'Thursday', title: 'Burger Night', desc: '$20 Burger & Pot combos.' },
  { id: 5, day: 'Friday', title: 'Happy Hour', desc: '$10 Selected Pints from 4pm – 7pm.' },
  { id: 6, day: 'Saturday', title: 'Saturday Steal', desc: '$10 Pints All Day.' },
];

const Specials = ({ setActiveTab, beers = [], setSelectedBeer }) => {
  const scrollRef = useRef(null);
  const todayIndex = new Date().getDay(); 

  const featuredBeer = beers.find(b => parseInt(b.tap_number) === 4);

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / 7;
      const offset = (cardWidth * todayIndex) - (window.innerWidth / 2) + (cardWidth / 2);
      
      scrollRef.current.scrollTo({
        left: offset,
        behavior: 'smooth'
      });
    }
  }, [todayIndex]);

  const handleFeatureClick = () => {
    if (featuredBeer) {
      setSelectedBeer(featuredBeer);
      setActiveTab('menu');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1a1a] pb-20 pt-15">
      
      {/* TOP HALF: Weekly Carousel */}
      <div className="flex-1 flex flex-col justify-center w-full overflow-hidden relative">   
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-4 opacity-80">
          <ArrowLeft size={10} className="animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Swipe</span>
          <ArrowRight size={10} className="animate-pulse" />
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory overscroll-contain px-[20vw] pb-8 pt-2 gap-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }} 
        >
          {specialsData.map((special) => {
            const isToday = special.id === todayIndex;

            return (
              <div 
                key={special.id} 
                className={`
                  snap-center flex-shrink-0 w-[60vw] p-6 rounded-3xl flex flex-col justify-center items-center text-center transition-all duration-300
                  ${isToday 
                    ? 'bg-[#222] border-2 border-[#F3931B] shadow-[0_10px_30px_rgba(243,147,27,0.15)] scale-100 opacity-100' 
                    : 'bg-[#111] border border-gray-800 scale-95 opacity-80'
                  }
                `}
              >
                {isToday && (
                  <span className="bg-[#F3931B] text-black text-[9px] font-black uppercase px-3 py-1 rounded-full mb-4 tracking-widest">
                    Today
                  </span>
                )}
                <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${isToday ? 'text-white' : 'text-gray-400'}`}>
                  {special.day}
                </h3>
                <h4 className={`text-sm font-bold uppercase mb-2 ${isToday ? 'text-[#F3931B]' : 'text-gray-500'}`}>
                  {special.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                  {special.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM HALF: Featured Brew */}
      <div className="flex-1 flex flex-col justify-center px-4">
        
        <div 
          onClick={handleFeatureClick}
          className="relative w-full h-full max-h-[220px] bg-gradient-to-br from-[#222] to-[#111] border border-gray-800 rounded-3xl p-6 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform overflow-hidden group"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#F3931B] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

          {/* Dynamically load the real can image if available, fallback to Emoji */}
          <div className="w-20 h-28 flex items-center justify-center flex-shrink-0 z-10 -my-4">
            {featuredBeer?.image_url ? (
              <img src={featuredBeer.image_url} alt={featuredBeer.name} className="w-full h-full object-contain drop-shadow-2xl" />
            ) : (
              <div className="text-6xl drop-shadow-2xl">🍺</div>
            )}
          </div>

          <div className="flex-1 pl-5 z-10 flex flex-col justify-center text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#F3931B] animate-pulse"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Featured Brew</span>
            </div>
            
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">
              {featuredBeer ? featuredBeer.name : 'Loading...'}
            </h2>
            <p className="text-[#F3931B] text-[10px] font-bold uppercase tracking-wider mb-2">
              Tap 4 · {featuredBeer ? featuredBeer.style : 'Lager'}
            </p>
            
            {/* Added short_desc directly from the Google Sheet */}
            <p className="text-gray-400 text-[10px] leading-snug line-clamp-2 mb-3">
              {featuredBeer ? featuredBeer.short_desc : ''}
            </p>
            
            <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest group-active:text-[#F3931B] transition-colors">
              <span>View Tasting Notes</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specials;