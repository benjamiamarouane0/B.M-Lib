import React, { useState, useEffect } from 'react';
import { ListSearchResultDoc, ListSeed, BookSearchResult } from '../types';
import { getListSeeds } from '../services/openLibraryService';
import CloseIcon from './icons/CloseIcon';
import Spinner from './Spinner';

interface ListDetailModalProps {
  list: ListSearchResultDoc;
  onClose: () => void;
  onSelectBook: (book: BookSearchResult) => void;
}

const ListDetailModal: React.FC<ListDetailModalProps> = ({ list, onClose, onSelectBook }) => {
  const [seeds, setSeeds] = useState<ListSeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeeds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getListSeeds(list.url);
        setSeeds(response.entries);
      } catch (err) {
        setError('Failed to load the contents of this list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeeds();
  }, [list.url]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSeedClick = (seed: ListSeed) => {
    if (seed.type === 'edition' || seed.type === 'work') {
      const book: BookSearchResult = {
        key: seed.url,
        title: seed.title,
      };
      onSelectBook(book);
    }
    // Could handle other types like author in the future
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{list.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{list.seed_count} items in this list</p>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto p-6 flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="w-10 h-10" />
            </div>
          ) : error ? (
             <p className="text-center text-red-500 py-10">{error}</p>
          ) : seeds.length > 0 ? (
            <ul className="space-y-3">
              {seeds.map((seed) => (
                <li key={seed.url}>
                  <button
                    onClick={() => handleSeedClick(seed)}
                    disabled={seed.type !== 'edition' && seed.type !== 'work'}
                    className="w-full text-left p-3 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-4 disabled:opacity-50 disabled:hover:bg-slate-50 dark:disabled:hover:bg-slate-800"
                  >
                    {seed.picture?.url ? (
                        <img src={seed.picture.url} alt={`Cover for ${seed.title}`} className="w-12 h-16 object-cover rounded-sm flex-shrink-0" />
                    ) : (
                        <div className="w-12 h-16 bg-slate-200 dark:bg-slate-700 rounded-sm flex-shrink-0"></div>
                    )}
                    <div className="flex-grow">
                        <p className="font-semibold text-indigo-700 dark:text-indigo-400">{seed.title}</p>
                        <p className="text-sm text-slate-500 capitalize">{seed.type}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-10">This list is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDetailModal;