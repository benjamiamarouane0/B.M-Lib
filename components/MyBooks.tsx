import React, { useState } from 'react';
import { BookSearchResult } from '../types';
import BookCard from './BookCard';

interface MyBooksProps {
  shelves: {
    wantToRead: BookSearchResult[];
    currentlyReading: BookSearchResult[];
    alreadyRead: BookSearchResult[];
  };
  username: string;
  onSelectBook: (book: BookSearchResult) => void;
}

type ShelfKey = 'wantToRead' | 'currentlyReading' | 'alreadyRead';

const shelfLabels: Record<ShelfKey, string> = {
  wantToRead: 'Want to Read',
  currentlyReading: 'Currently Reading',
  alreadyRead: 'Already Read',
};

const MyBooks: React.FC<MyBooksProps> = ({ shelves, username, onSelectBook }) => {
  const [activeTab, setActiveTab] = useState<ShelfKey>('wantToRead');

  const renderShelf = (shelfKey: ShelfKey) => {
    const books = shelves[shelfKey];
    if (!books || books.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-slate-500 dark:text-slate-400">No books found on this shelf.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {books.map((book) => (
          <BookCard key={book.key} book={book} onSelectBook={onSelectBook} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Reading Shelves for <span className="text-indigo-500">{username}</span>
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">Viewing public reading logs from Open Library.</p>

      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {(Object.keys(shelves) as ShelfKey[]).map((shelfKey) => (
            <button
              key={shelfKey}
              onClick={() => setActiveTab(shelfKey)}
              className={`${
                activeTab === shelfKey
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {shelfLabels[shelfKey]} ({shelves[shelfKey]?.length || 0})
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderShelf(activeTab)}
      </div>
    </div>
  );
};

export default MyBooks;