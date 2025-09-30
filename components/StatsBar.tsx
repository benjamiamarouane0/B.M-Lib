import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';
import ListIcon from './icons/ListIcon';
import UsersIcon from './icons/UsersIcon';

const StatItem: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex flex-col items-center text-center">
    <div className="p-4 bg-white dark:bg-slate-700/50 rounded-full shadow-inner">
      {icon}
    </div>
    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

const StatsBar: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatItem 
            icon={<BookOpenIcon className="w-7 h-7 text-indigo-500" />}
            value="30M+"
            label="Works Cataloged"
          />
          <StatItem 
            icon={<ListIcon className="w-7 h-7 text-green-500" />}
            value="100M+"
            label="Total Editions"
          />
          <StatItem 
            icon={<UsersIcon className="w-7 h-7 text-orange-500" />}
            value="8M+"
            label="Authors Archived"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
