import React, { useState, useEffect } from 'react';
import { AuthorSearchResult } from '../types';
import { searchAuthors } from '../services/openLibraryService';
import AuthorList from './AuthorList';
import Spinner from './Spinner';

interface AuthorsPageProps {
  onSelectAuthor: (author: AuthorSearchResult) => void;
}

const initialPopularAuthors = [
  'J.K. Rowling', 'Stephen King', 'George R.R. Martin', 'J.R.R. Tolkien', 'Agatha Christie',
  'William Shakespeare', 'Jane Austen', 'Isaac Asimov', 'Neil Gaiman', 'Haruki Murakami',
];

const morePopularAuthors = [
  'Margaret Atwood', 'Philip K. Dick', 'Kurt Vonnegut', 'Virginia Woolf', 'Ernest Hemingway',
  'Mark Twain', 'Charles Dickens', 'Leo Tolstoy', 'Gabriel García Márquez', 'Toni Morrison',
  'Fyodor Dostoevsky', 'George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'Frank Herbert',
  'Ursula K. Le Guin', 'Terry Pratchett', 'Douglas Adams', 'H.P. Lovecraft', 'Edgar Allan Poe'
];

const AuthorsPage: React.FC<AuthorsPageProps> = ({ onSelectAuthor }) => {
  const [initialAuthors, setInitialAuthors] = useState<AuthorSearchResult[]>([]);
  const [additionalAuthors, setAdditionalAuthors] = useState<AuthorSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreAuthorsFetched, setMoreAuthorsFetched] = useState(false);

  useEffect(() => {
    const fetchInitialAuthors = async () => {
      setLoading(true);
      setError(null);
      try {
        const authorPromises = initialPopularAuthors.map(async (name) => {
          const response = await searchAuthors(name);
          return response.docs.length > 0 ? response.docs[0] : null;
        });

        const results = await Promise.all(authorPromises);
        const validAuthors = results.filter((author): author is AuthorSearchResult => author !== null);
        setInitialAuthors(validAuthors);

      } catch (err) {
        setError('Failed to fetch author information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAuthors();
  }, []);

  const handleShowMore = async () => {
    setLoadingMore(true);
    setMoreAuthorsFetched(true);
    setError(null); // Clear previous errors if retrying
    try {
        const authorPromises = morePopularAuthors.map(async (name) => {
          const response = await searchAuthors(name);
          return response.docs.length > 0 ? response.docs[0] : null;
        });

        const results = await Promise.all(authorPromises);
        const newAuthors = results.filter((author): author is AuthorSearchResult => author !== null);
        setAdditionalAuthors(newAuthors);
    } catch (err) {
        setError('Failed to fetch more authors. Please try again later.');
    } finally {
        setLoadingMore(false);
    }
  };

  const allAuthors = [...initialAuthors, ...additionalAuthors].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-400">Discover Authors</h1>
        <p className="mt-3 text-lg text-yellow-300">
          Explore a curated list of popular and influential authors from various genres and eras.
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="h-12 w-12 text-indigo-600" />
        </div>
      ) : error && initialAuthors.length === 0 ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : initialAuthors.length > 0 ? (
        <>
            <AuthorList authors={allAuthors} loading={false} onSelectAuthor={onSelectAuthor} />

            {error && <p className="text-center text-red-500 py-4 mt-4">{error}</p>}
            
            {loadingMore && (
                <div className="flex justify-center items-center py-10">
                    <Spinner className="h-10 w-10 text-indigo-600" />
                </div>
            )}
            
            {!moreAuthorsFetched && !loadingMore && (
                <div className="text-center mt-12">
                    <button
                        onClick={handleShowMore}
                        className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-colors shadow-lg disabled:bg-orange-400"
                    >
                        Show more authors
                    </button>
                </div>
            )}
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No Authors Found</h2>
          <p className="text-slate-500 mt-2">We couldn't load our list of popular authors at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default AuthorsPage;