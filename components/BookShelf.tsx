import React, { useState, useEffect } from 'react';
import { BookSearchResult, SortOrder } from '../types';
import { getBooksBySubject } from '../services/openLibraryService';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';

interface BookShelfProps {
  title: string;
  subject: string;
  sort: SortOrder;
  onSelectBook: (book: BookSearchResult) => void;
  onShowAll: (category: { title: string; subject: string; sort: SortOrder }) => void;
}

const BookShelf: React.FC<BookShelfProps> = ({ title, subject, sort, onSelectBook, onShowAll }) => {
  const [books, setBooks] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      // Fetch a bit more than we need in case some items don't have covers or essential data
      const results = await getBooksBySubject(subject, sort, 16);
      if (results && results.length > 0) {
        setBooks(results.slice(0, 15)); // Limit to 15 books for the preview
      }
      setLoading(false);
    };

    fetchBooks();
  }, [subject, sort]);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (books.length === 0) {
      return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
        {books.map((book, index) => (
          <BookCard 
            key={book.key} 
            book={book} 
            onSelectBook={onSelectBook}
            variant={index % 3 === 1 ? 'overlay' : 'default'} // Alternate designs
          />
        ))}
      </div>
      <div className="text-center mt-6">
        <button 
            onClick={() => onShowAll({ title, subject, sort })}
            className="px-6 py-2 border border-sky-500 text-sky-600 dark:text-sky-400 dark:border-sky-400 rounded-full font-semibold hover:bg-sky-600 hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-900 transition-colors duration-200"
        >
            Show all books in this category &rarr;
        </button>
      </div>
    </section>
  );
};

export default React.memo(BookShelf);