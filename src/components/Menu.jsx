const beerData = [
  { id: 1, name: "Juice Loosener", style: "Hazy IPA", abv: "6.5%", desc: "Thick, juicy, luscious. A tropical hop bomb." },
  { id: 2, name: "Auburn", style: "Irish Red Ale", abv: "5.7%", desc: "Malty and rich with toffee and caramel notes." },
  { id: 3, name: "Pacific Rim", style: "Pale Ale", abv: "5.0%", desc: "Tropical hit of pineapple and passionfruit." },
  { id: 4, name: "Glen All Day", style: "Lager", abv: "4.5%", desc: "Classic, crisp, and dry. The ultimate sessionable pint." },
  { id: 5, name: "Audacity", style: "IPA", abv: "6.2%", desc: "Classic West Coast bitterness with a citrus finish." },
  { id: 6, name: "The King's Peach", style: "Peach Sour", abv: "5.1%", desc: "Imperial sour with a punch of fresh peach." }
];

const Menu = () => {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-black text-[#F3931B] uppercase tracking-tighter">Live Taps</h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Fresh from the West</p>
      </header>

      <div className="grid gap-4 px-4">
        {beerData.map((beer) => (
          <div key={beer.id} className="bg-[#222] border-l-4 border-[#F3931B] p-4 rounded-r-lg flex justify-between items-start group active:bg-[#2a2a2a] transition-all">
            <div className="text-left">
              <h2 className="text-white font-bold text-lg uppercase leading-tight">{beer.name}</h2>
              <p className="text-[#F3931B] text-xs font-bold uppercase tracking-wide mb-1">{beer.style}</p>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">{beer.desc}</p>
            </div>
            <div className="bg-[#1a1a1a] px-2 py-1 rounded border border-gray-700">
              <span className="text-white font-mono text-xs">{beer.abv}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;