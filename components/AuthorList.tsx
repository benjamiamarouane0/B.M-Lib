import React from 'react';
import { AuthorSearchResult } from '../types';
import AuthorCard from './AuthorCard';
import Spinner from './Spinner';

interface AuthorListProps {
  authors: AuthorSearchResult[];
  loading: boolean;
  onSelectAuthor: (author: AuthorSearchResult) => void;
}

const AuthorList: React.FC<AuthorListProps> = ({ authors, loading, onSelectAuthor }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner className="h-10 w-10 text-indigo-600" />
        <span className="ml-4 text-slate-700 dark:text-slate-300">Searching for authors...</span>
      </div>
    );
  }

  if (authors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {authors.map((author) => (
        <AuthorCard key={author.key} author={author} onSelectAuthor={onSelectAuthor} />
      ))}
    </div>
  );
};

export default React.memo(AuthorList);
