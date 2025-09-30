import React from 'react';
import { BookSearchResult } from '../types';
import { getCoverUrl } from '../services/openLibraryService';

interface BookCardProps {
  book: BookSearchResult;
  onSelectBook: (book: BookSearchResult) => void;
  variant?: 'default' | 'overlay';
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelectBook, variant = 'default' }) => {
  const coverUrl = getCoverUrl({ id: book.cover_i }, 'L'); // Use larger covers

  const ImageComponent = () => (
    <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md hover:shadow-xl bg-slate-100 dark:bg-slate-800 transition-shadow duration-300">
      <img
        src={coverUrl}
        alt={`Cover for ${book.title}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );

  if (variant === 'overlay') {
    // This variant now has text below the image, but center-aligned for visual variety.
    return (
      <div
        onClick={() => onSelectBook(book)}
        className="cursor-pointer group"
        role="button"
        aria-label={`View details for ${book.title}`}
      >
        <ImageComponent />
        <div className="pt-3 text-center">
          <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
          </p>
          {book.first_publish_year && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Pub. {book.first_publish_year}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default variant with left-aligned text below the image
  return (
    <div
      onClick={() => onSelectBook(book)}
      className="cursor-pointer group"
      role="button"
      aria-label={`View details for ${book.title}`}
    >
      <ImageComponent />
      <div className="pt-3">
        <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
        </p>
        {book.first_publish_year && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              First published {book.first_publish_year}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(BookCard);
