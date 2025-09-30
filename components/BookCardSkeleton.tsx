import React from 'react';

const BookCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="mt-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
