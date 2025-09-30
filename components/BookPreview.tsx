import React, { useState, useEffect } from 'react';
import { BookSearchResult } from '../types';
import { getBooksBySubject } from '../services/openLibraryService';
import BookCard from './BookCard';
import Spinner from './Spinner';

interface BookPreviewProps {
  title: string;
  onSelectBook: (book: BookSearchResult) => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ title, onSelectBook }) => {
  const [books, setBooks] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const results = await getBooksBySubject(title);
      if (results && results.length > 0) {
        setBooks(results);
      }
      setLoading(false);
    };

    fetchBooks();
  }, [title]);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{title}</h2>
        <div className="flex items-center justify-center h-80 bg-slate-200 dark:bg-slate-800/50 rounded-lg">
            <Spinner className="h-8 w-8 text-indigo-500" />
        </div>
      </section>
    );
  }

  if (books.length === 0) {
      return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{title}</h2>
      <div className="grid grid-flow-col auto-cols-max gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 custom-scrollbar">
        {books.map(book => (
          <div key={book.key} className="w-52">
            <BookCard book={book} onSelectBook={onSelectBook} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookPreview;