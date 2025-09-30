import React from 'react';
import { ListSearchResultDoc } from '../types';
import { timeAgo } from '../utils/time';
import ListIcon from './icons/ListIcon';

interface ListCardProps {
  list: ListSearchResultDoc;
  onSelectList: (list: ListSearchResultDoc) => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onSelectList }) => {
  const getCreator = (fullUrl: string) => {
    const match = fullUrl.match(/\/people\/([^/]+)/);
    return match ? match[1] : 'Unknown';
  };

  const creator = getCreator(list.full_url);

  return (
    <div
      onClick={() => onSelectList(list)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden cursor-pointer group p-4 flex flex-col"
    >
      <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <ListIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={list.name}>
              {list.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              by <span className="font-medium">{creator}</span>
            </p>
          </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between text-sm text-slate-600 dark:text-slate-400">
        <span>{list.seed_count} items</span>
        <span>Updated {timeAgo(list.last_update)}</span>
      </div>
    </div>
  );
};

export default ListCard;