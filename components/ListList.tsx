import React from 'react';
import { ListSearchResultDoc } from '../types';
import ListCard from './ListCard';
import Spinner from './Spinner';

interface ListListProps {
  lists: ListSearchResultDoc[];
  loading: boolean;
  onSelectList: (list: ListSearchResultDoc) => void;
}

const ListList: React.FC<ListListProps> = ({ lists, loading, onSelectList }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner className="h-10 w-10 text-indigo-600" />
        <span className="ml-4 text-slate-700 dark:text-slate-300">Searching for lists...</span>
      </div>
    );
  }

  if (lists.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <ListCard key={list.url} list={list} onSelectList={onSelectList} />
      ))}
    </div>
  );
};

export default ListList;