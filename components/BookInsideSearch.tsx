import React, { useState } from 'react';
import { getArchiveMetadata, searchInsideBook } from '../services/openLibraryService';
import { InsideSearchMatch } from '../types';
import SearchIcon from './icons/SearchIcon';
import Spinner from './Spinner';

interface BookInsideSearchProps {
  iaId: string;
}

const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
    // Split the text by the highlight markers `{{{...}}}`, capturing the content within.
    // This creates an array where every odd-indexed element is a highlighted term.
    const parts = text.split(/{{{(.*?)}}}/g);

    return (
        <p className="text-slate-600 dark:text-slate-400">
            {parts.map((part, i) => {
                // Odd-indexed parts are the highlighted content.
                if (i % 2 === 1) {
                    return (
                        <strong key={i} className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-1 rounded">
                            {part}
                        </strong>
                    );
                }
                // Even-indexed parts are the normal text.
                // We check if the part is not empty before rendering a span.
                return part ? <span key={i}>{part}</span> : null;
            })}
        </p>
    );
};


const BookInsideSearch: React.FC<BookInsideSearchProps> = ({ iaId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<InsideSearchMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchCount, setMatchCount] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const metadata = await getArchiveMetadata(iaId);
      const searchData = await searchInsideBook(metadata.server, metadata.dir, iaId, query);
      setResults(searchData.matches);
      setMatchCount(searchData.matches.length);
    } catch (err) {
      setError('Failed to search inside this book. The content may not be available for searching.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., library science"
          className="flex-grow pl-4 pr-4 py-2 border border-slate-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          disabled={loading}
        />
        <button
          type="submit"
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          disabled={loading || !query.trim()}
          aria-label="Search inside book"
        >
          {loading ? <Spinner className="w-5 h-5 text-white -ml-0 mr-0" /> : <SearchIcon className="w-5 h-5" />}
        </button>
      </form>
      
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {results && (
        <div>
          {results.length > 0 ? (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Found {matchCount} match{matchCount !== 1 ? 'es' : ''}.
              </p>
              <ul className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {results.map((match, index) => (
                  <li key={index} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <HighlightedText text={match.text} />
                    {match.par?.[0]?.page && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-right">
                        Page {match.par[0].page}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">No matches found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookInsideSearch;