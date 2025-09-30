import React from 'react';

interface HeaderProps {
  view: string;
  onGoHome: () => void;
  onShowSubjects: () => void;
  onShowAuthors: () => void;
  onShowAbout: () => void;
}

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-xs sm:text-sm font-bold uppercase pb-1 whitespace-nowrap transition-colors ${
      isActive
        ? 'border-b-2 border-[#4F433A] text-[#4F433A]'
        : 'text-[#4F433A]/80 hover:text-[#4F433A]'
    }`}
  >
    {label}
  </button>
);


const Header: React.FC<HeaderProps> = ({ view, onGoHome, onShowSubjects, onShowAuthors, onShowAbout }) => {
  const handleNavClick = (handler: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handler();
  };

  return (
    <header className="bg-[#F5F1E8] text-[#4F433A] sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <button
              onClick={handleNavClick(onGoHome)}
              className="flex items-center text-2xl font-bold tracking-wider"
              aria-label="Go to homepage"
            >
              B.M Lib
            </button>
            <nav aria-label="Main navigation" className="flex items-center space-x-4 sm:space-x-8">
              <NavLink label="Home" isActive={view === 'home'} onClick={handleNavClick(onGoHome)} />
              <NavLink label="Subjects" isActive={view === 'subjects'} onClick={handleNavClick(onShowSubjects)} />
              <NavLink label="Authors" isActive={view === 'authors'} onClick={handleNavClick(onShowAuthors)} />
              <NavLink label="About us" isActive={view === 'about'} onClick={handleNavClick(onShowAbout)} />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;