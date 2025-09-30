import React from 'react';
import { BookSearchResult, AuthorSearchResult } from '../types';
import { timeAgo } from '../utils/time';
import PlusCircleIcon from './icons/PlusCircleIcon';
import PencilIcon from './icons/PencilIcon';
import UsersIcon from './icons/UsersIcon';
import BookOpenIcon from './icons/BookOpenIcon';

export type ChangeSubject = BookSearchResult | AuthorSearchResult;

interface ChangeCardProps {
  change: {
    id: string;
    kind: string;
    timestamp: string;
    comment: string;
    author: { key: string } | null;
    subject: ChangeSubject | null;
  };
  onSelectBook: (book: BookSearchResult) => void;
  onSelectAuthor: (author: AuthorSearchResult) => void;
}

const getChangeInfo = (kind: string): { icon: React.ReactNode; title: string } => {
  switch (kind) {
    case 'add-book':
      return { icon: <PlusCircleIcon className="w-5 h-5 text-green-500" />, title: 'Book Added' };
    case 'edit-book':
      return { icon: <PencilIcon className="w-5 h-5 text-blue-500" />, title: 'Book Edited' };
    case 'merge-authors':
      return { icon: <UsersIcon className="w-5 h-5 text-purple-500" />, title: 'Authors Merged' };
    default:
      return { icon: <BookOpenIcon className="w-5 h-5 text-slate-500" />, title: 'Update' };
  }
};

const ChangeCard: React.FC<ChangeCardProps> = ({ change, onSelectBook, onSelectAuthor }) => {
  const { icon, title } = getChangeInfo(change.kind);
  const authorName = change.author ? change.author.key.replace('/people/', '') : 'Anonymous';

  const isBook = (subject: ChangeSubject | null): subject is BookSearchResult => {
    return subject !== null && 'first_publish_year' in subject;
  };
  
  const isAuthor = (subject: ChangeSubject | null): subject is AuthorSearchResult => {
      return subject !== null && 'work_count' in subject;
  };

  const handleSelect = () => {
    if (isBook(change.subject)) {
        onSelectBook(change.subject);
    } else if (isAuthor(change.subject)) {
        onSelectAuthor(change.subject);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{authorName}</span>
          {' '}{title.replace('Book', '').replace('Authors', '').toLowerCase()}
        </p>
        
        <button 
            onClick={handleSelect}
            disabled={!change.subject}
            className="text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:no-underline disabled:text-slate-700 dark:disabled:text-slate-300 text-left"
        >
            {change.subject ? (isBook(change.subject) ? change.subject.title : change.subject.name) : 'an item'}
        </button>

        {change.comment && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 italic border-l-2 border-slate-200 dark:border-slate-600 pl-2">
            "{change.comment}"
          </p>
        )}
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{timeAgo(change.timestamp)}</p>
      </div>
    </div>
  );
};

export default ChangeCard;