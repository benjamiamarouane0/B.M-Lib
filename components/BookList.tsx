import React from 'react';
import { BookSearchResult } from '../types';
import BookCard from './BookCard';
import Spinner from './Spinner';

interface BookListProps {
  books: BookSearchResult[];
  loading: boolean;
  onSelectBook: (book: BookSearchResult) => void;
}

const BookList: React.FC<BookListProps> = ({ books, loading, onSelectBook }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner className="h-10 w-10 text-indigo-600" />
        <span className="ml-4 text-slate-700 dark:text-slate-300">Searching for books...</span>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
      {books.map((book, index) => (
        <BookCard 
          key={book.key} 
          book={book} 
          onSelectBook={onSelectBook}
          variant={index % 3 === 1 ? 'overlay' : 'default'} // Alternate designs
        />
      ))}
    </div>
  );
};

export default React.memo(BookList);
