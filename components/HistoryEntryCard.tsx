import React from 'react';
import { HistoryEntry } from '../types';
import { timeAgo } from '../utils/time';
import PencilIcon from './icons/PencilIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import UsersIcon from './icons/UsersIcon';
import HistoryIcon from './icons/HistoryIcon';

interface HistoryEntryCardProps {
  entry: HistoryEntry;
}

const getActionInfo = (action: string): { icon: React.ReactNode; title: string } => {
  const formattedAction = action.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  switch (action) {
    case 'create':
      return { icon: <PlusCircleIcon className="w-5 h-5 text-green-500" />, title: 'Created' };
    case 'update':
      return { icon: <PencilIcon className="w-5 h-5 text-blue-500" />, title: 'Updated' };
    case 'merge-authors':
      return { icon: <UsersIcon className="w-5 h-5 text-purple-500" />, title: 'Merged Authors' };
    case 'add-photo':
      return { icon: <PlusCircleIcon className="w-5 h-5 text-teal-500" />, title: 'Added Photo' };
    default:
      return { icon: <HistoryIcon className="w-5 h-5 text-slate-500" />, title: formattedAction };
  }
};

const HistoryEntryCard: React.FC<HistoryEntryCardProps> = ({ entry }) => {
  const { icon, title } = getActionInfo(entry.action);
  const editorName = entry.author ? entry.author.replace('/people/', '') : 'System';

  return (
    <div className="flex items-start space-x-4 py-3">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-full">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{editorName}</span>
                {' '}{title.toLowerCase()} this entry.
            </p>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2">{timeAgo(entry.created)}</span>
        </div>
        {entry.comment && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 italic border-l-2 border-slate-200 dark:border-slate-600 pl-2">
            "{entry.comment}"
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryEntryCard;