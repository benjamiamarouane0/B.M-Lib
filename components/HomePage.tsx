import React from 'react';
import Hero from './Hero';
import BookShelf from './BookShelf';
import { BookSearchResult, SortOrder } from '../types';

type Category = { title: string; subject: string; sort: SortOrder };

interface HomePageProps {
  onSelectBook: (book: BookSearchResult) => void;
  onShowAll: (category: Category) => void;
  categories: Category[];
  onSearch: (query: string, startYear: string, endYear: string) => void;
  loadingSearch: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectBook, onShowAll, categories, onSearch, loadingSearch }) => {
  return (
    <>
      <Hero onSearch={onSearch} loading={loadingSearch} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {categories.map(category => (
          <BookShelf
            key={category.title}
            title={category.title}
            subject={category.subject}
            sort={category.sort}
            onSelectBook={onSelectBook}
            onShowAll={onShowAll}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;
