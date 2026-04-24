// src/components/Header.jsx

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-[#222]/80 backdrop-blur-md border-b border-white/5">
      {/* Container keeps the logo centered even on huge screens */}
      <div className="max-w-screen-xl mx-auto h-16 flex items-center justify-center px-4">
        <h1 className="text-[#F3931B] font-black tracking-[4px] text-sm sm:text-base md:text-lg">
          RAMBLERS ALE WORKS
        </h1>
      </div>
    </header>
  );
};

export default Header;