import React from 'react';
import QuoteIcon from './icons/QuoteIcon';
import SearchBar from './SearchBar';

interface HeroProps {
  onSearch: (query: string, startYear: string, endYear: string) => void;
  loading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, loading }) => {
  const heroStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop')",
  };
  
  return (
    <div 
      className="relative bg-cover bg-center text-white py-16 sm:py-20 overflow-hidden"
      style={heroStyle}
      role="img"
      aria-label="A vast library with shelves full of old books"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <section className="max-w-3xl mx-auto text-center" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-yellow-300">
            Explore a Universe of Books
          </h1>
          <div className="mt-6 max-w-xl mx-auto">
             <blockquote className="flex items-start justify-center">
                <QuoteIcon className="w-8 h-8 flex-shrink-0 text-yellow-300/50 mr-4 transform -scale-x-100" />
                <p className="text-lg sm:text-xl text-yellow-100 italic">
                    A reader lives a thousand lives before he dies... The man who never reads lives only one.
                </p>
            </blockquote>
          </div>
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar onSearch={onSearch} loading={loading} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
