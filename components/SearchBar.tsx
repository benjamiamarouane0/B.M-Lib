import React, { useState, useEffect } from 'react';
import SearchIcon from './icons/SearchIcon';
import Spinner from './Spinner';
import FilterIcon from './icons/FilterIcon';

interface SearchBarProps {
  onSearch: (query: string, startYear: string, endYear: string) => void;
  loading: boolean;
  initialQuery?: string;
  initialStartYear?: string;
  initialEndYear?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading, initialQuery = '', initialStartYear = '', initialEndYear = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [startYear, setStartYear] = useState(initialStartYear);
  const [endYear, setEndYear] = useState(initialEndYear);
  const [showFilters, setShowFilters] = useState(!!(initialStartYear || initialEndYear));

  useEffect(() => { setQuery(initialQuery) }, [initialQuery]);
  useEffect(() => { setStartYear(initialStartYear) }, [initialStartYear]);
  useEffect(() => { setEndYear(initialEndYear) }, [initialEndYear]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSearch(query, startYear, endYear);
  };
  
  const inputStyles = "w-full p-3 border-2 border-slate-300 rounded-lg text-lg bg-white/90 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-400 transition-shadow shadow-sm hover:bg-white";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
          <div className="relative flex-grow">
              <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for books, authors, subjects..."
                  className="w-full pl-12 pr-12 py-3 border-2 border-transparent rounded-full text-lg bg-white/90 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-400 transition-shadow shadow-lg hover:bg-white"
                  disabled={loading}
                  aria-label="Search for books"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon className="h-6 w-6 text-slate-400" />
              </div>
              {loading && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <Spinner className="h-6 w-6 text-indigo-600" />
                  </div>
              )}
          </div>
          <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-shrink-0 p-3 rounded-full hover:bg-white focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all shadow-lg ${showFilters ? 'bg-orange-100' : 'bg-white/90'}`}
              aria-label="Toggle search filters"
              aria-expanded={showFilters}
          >
              <FilterIcon className="h-6 w-6 text-slate-600" />
          </button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/50 dark:bg-slate-800/20 p-4 rounded-lg shadow-inner backdrop-blur-sm">
          <div>
            <label htmlFor="start-year" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Start Year</label>
            <input
              id="start-year"
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              placeholder="e.g., 1984"
              className={inputStyles}
              aria-label="Start publication year"
            />
          </div>
          <div>
             <label htmlFor="end-year" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">End Year</label>
            <input
              id="end-year"
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              placeholder="e.g., 2023"
              className={inputStyles}
              aria-label="End publication year"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default React.memo(SearchBar);
