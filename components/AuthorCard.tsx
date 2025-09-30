import React from 'react';
import { AuthorSearchResult } from '../types';
import { getAuthorPhotoUrl } from '../services/openLibraryService';

interface AuthorCardProps {
  author: AuthorSearchResult;
  onSelectAuthor: (author: AuthorSearchResult) => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, onSelectAuthor }) => {
  const photoUrl = getAuthorPhotoUrl({ olid: author.key }, 'M');

  return (
    <div
      onClick={() => onSelectAuthor(author)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden cursor-pointer group flex flex-col items-center text-center p-4"
    >
      <div className="relative w-32 h-32 mb-4">
        <img
          src={photoUrl}
          alt={`Photo of ${author.name}`}
          className="w-full h-full rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-500 transition-all"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" title={author.name}>
          {author.name}
        </h3>
        {author.birth_date && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {author.birth_date}
          </p>
        )}
        {author.top_work && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow">
                Top work: <em className="italic">{author.top_work}</em>
            </p>
        )}
         <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            {author.work_count} works
          </p>
      </div>
    </div>
  );
};

export default React.memo(AuthorCard);
