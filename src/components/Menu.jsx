// We don't need useState, useEffect, or PapaParse here anymore!

// 1. Accept the data as "props" from App.jsx
const Menu = ({ beers, isLoading }) => {
  
  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-black text-[#F3931B] uppercase tracking-tighter">Live Taps</h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Fresh from the West</p>
      </header>

      <div className="grid gap-4 px-4">
        {isLoading ? (
          <div className="text-center text-[#F3931B] py-10 uppercase tracking-widest text-sm animate-pulse font-bold">
            Tapping Kegs...
          </div>
        ) : (
          beers.map((beer, index) => (
            <div key={index} className="bg-[#222] border-l-4 border-[#F3931B] p-4 rounded-r-lg flex justify-between items-start group active:bg-[#2a2a2a] transition-all">
              <div className="text-left pr-4">
                <h2 className="text-white font-bold text-lg uppercase leading-tight">{beer.name}</h2>
                <p className="text-[#F3931B] text-xs font-bold uppercase tracking-wide mb-1">{beer.style}</p>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">{beer.desc}</p>
              </div>
              <div className="bg-[#1a1a1a] px-2 py-1 rounded border border-gray-700 flex-shrink-0 mt-1">
                <span className="text-white font-mono text-xs">{beer.abv}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;