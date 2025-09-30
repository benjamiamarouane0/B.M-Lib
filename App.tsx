import React, { useState, useCallback, useEffect } from 'react';
import { BookSearchResult, BookDetails, AuthorSearchResult, SortOrder } from './types';
import { getBookDetails, getBooksBySubject, searchBooks, searchAuthors } from './services/openLibraryService';
import BookList from './components/BookList';
import AuthorList from './components/AuthorList';
import BookDetailModal from './components/BookDetailModal';
import AuthorDetailModal from './components/AuthorDetailModal';
import Spinner from './components/Spinner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SearchBar from './components/SearchBar';
import SubjectsPage from './components/SubjectsPage';
import AuthorsPage from './components/AuthorsPage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import { usePageMetadata } from './hooks/usePageMetadata';
import SchemaInjector from './components/SchemaInjector';

type View = 'home' | 'subject' | 'search' | 'subjects' | 'authors' | 'about' | 'terms' | 'privacy';
type Category = { title: string; subject: string; sort: SortOrder };

const CATEGORIES: Category[] = [
    { title: "Science Fiction Classics", subject: "science fiction", sort: 'editions' },
    { title: "Modern Fantasy", subject: "fantasy", sort: 'new' },
    { title: "Gripping Mysteries", subject: "thriller", sort: 'readinglog' },
    { title: "Epic Romances", subject: "historical romance", sort: 'want_to_read' },
    { title: "Adventures in History", subject: "world history", sort: 'readinglog' },
    { title: "Biographies & Memoirs", subject: "autobiography", sort: 'want_to_read' },
];

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [authorResults, setAuthorResults] = useState<AuthorSearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [subjectBooks, setSubjectBooks] = useState<BookSearchResult[]>([]);
  const [selectedBookDetails, setSelectedBookDetails] = useState<BookDetails | null>(null);
  const [selectedBookSearchResult, setSelectedBookSearchResult] = useState<BookSearchResult | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorSearchResult | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Category | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('home');

  usePageMetadata(view, { searchQuery, subjectTitle: selectedSubject?.title });

  const handleSearch = useCallback(async (query: string, start: string, end: string) => {
    if (!query.trim()) return;
    setView('search');
    setSearchQuery(query);
    setStartYear(start);
    setEndYear(end);
    setLoadingSearch(true);
    setError(null);
    try {
      const [booksResponse, authorsResponse] = await Promise.all([
        searchBooks(query, start, end),
        searchAuthors(query)
      ]);
      setSearchResults(booksResponse.docs);
      setAuthorResults(authorsResponse.docs);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  }, []);
  
  const handleSelectBook = useCallback(async (book: BookSearchResult) => {
    setLoading(true);
    setError(null);
    try {
      const details = await getBookDetails(book.key);
      if (details) {
        setSelectedBookDetails(details);
        setSelectedBookSearchResult(book);
      } else {
        setError(`Could not find details for "${book.title}". The record may have been moved or deleted.`);
      }
    } catch (err) {
      setError('Failed to fetch book details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleSelectAuthor = useCallback((author: AuthorSearchResult) => {
    setSelectedAuthor(author);
  }, []);

  const displaySubject = useCallback(async (category: Category) => {
    setSelectedBookDetails(null); // Close any open modal
    window.scrollTo(0, 0);
    setView('subject');
    setSelectedSubject(category);
    setLoading(true);
    setError(null);
    try {
      const books = await getBooksBySubject(category.subject, category.sort, 100);
      setSubjectBooks(books);
    } catch (err) {
      setError('Failed to fetch books for this category.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleSelectSubject = useCallback((subject: string) => {
      displaySubject({ title: subject, subject, sort: 'editions' });
  }, [displaySubject]);

  const handleCloseModal = useCallback(() => {
    setSelectedBookDetails(null);
    setSelectedBookSearchResult(null);
  }, []);

  const resetToHome = () => {
    setSubjectBooks([]);
    setSelectedSubject(null);
    setError(null);
    setSearchQuery('');
    setStartYear('');
    setEndYear('');
    setSearchResults([]);
    setAuthorResults([]);
    window.scrollTo(0, 0);
  };

  const handleGoHome = useCallback(() => {
    resetToHome();
    setView('home');
  }, []);

  const handleShowSubjects = useCallback(() => {
    resetToHome();
    setView('subjects');
  }, []);

  const handleShowAuthors = useCallback(() => {
    resetToHome();
    setView('authors');
  }, []);

  const handleShowAbout = useCallback(() => {
    resetToHome();
    setView('about');
  }, []);

  const handleShowTerms = useCallback(() => {
    resetToHome();
    setView('terms');
  }, []);

  const handleShowPrivacy = useCallback(() => {
    resetToHome();
    setView('privacy');
  }, []);


  const renderMainContent = () => {
    if (error) {
       return (
          <div className="container mx-auto p-4"><div className="text-center my-4 p-3 text-red-700 bg-red-100 rounded-md">
            {error}
          </div></div>
        );
    }

    switch(view) {
        case 'home':
            return (
                <HomePage 
                    categories={CATEGORIES}
                    onSelectBook={handleSelectBook}
                    onShowAll={displaySubject}
                    onSearch={handleSearch}
                    loadingSearch={loadingSearch}
                />
            );
        case 'subjects':
            return <SubjectsPage onSelectSubject={handleSelectSubject} />;
        case 'authors':
            return <AuthorsPage onSelectAuthor={handleSelectAuthor} />;
        case 'about':
            return <AboutPage />;
        case 'terms':
            return <TermsPage />;
        case 'privacy':
            return <PrivacyPolicyPage />;
        case 'search':
          return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-3xl mx-auto mb-8">
                <SearchBar 
                    onSearch={handleSearch} 
                    loading={loadingSearch}
                    initialQuery={searchQuery}
                    initialStartYear={startYear}
                    initialEndYear={endYear}
                />
              </div>
              <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                Search results for <span className="text-orange-600 dark:text-orange-400">"{searchQuery}"</span>
              </h1>
              {loadingSearch && <div className="flex justify-center items-center py-10"><Spinner className="h-10 w-10" /></div>}
              
              {!loadingSearch && authorResults.length > 0 && (
                <section className="mb-12" aria-labelledby="authors-heading">
                  <h2 id="authors-heading" className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Authors</h2>
                  <AuthorList authors={authorResults} loading={false} onSelectAuthor={handleSelectAuthor} />
                </section>
              )}
    
              {!loadingSearch && searchResults.length > 0 && (
                 <section className="mb-12" aria-labelledby="books-heading">
                  <h2 id="books-heading" className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Books</h2>
                  <BookList books={searchResults} loading={false} onSelectBook={handleSelectBook} />
                </section>
              )}
    
              {!loadingSearch && authorResults.length === 0 && searchResults.length === 0 && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No results found</h2>
                  <p className="text-slate-500 mt-2">Try a different search term or adjust your filters.</p>
                </div>
              )}
            </div>
          );
        case 'subject':
            if (selectedSubject) {
                const noResults = !loading && subjectBooks.length === 0;
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400">{selectedSubject.title}</h1>
                    {loading && <div className="flex justify-center items-center py-10"><Spinner className="h-10 w-10" /></div>}
                    {noResults && (
                        <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No books found for this category</h2>
                        <p className="text-slate-500 mt-2">There may have been an issue fetching these books. Please try again later.</p>
                        </div>
                    )}
                    <BookList books={subjectBooks} loading={false} onSelectBook={handleSelectBook} />
                    </div>
                );
            }
            return null;
        default:
            return null;
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://bmlib.example.com/",
    "name": "B.M Lib",
    "description": "Explore a Universe of Books with B.M Lib, your gateway to the Open Library. Search for books, discover authors, and browse subjects.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bmlib.example.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };


  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans flex flex-col">
      <SchemaInjector schema={websiteSchema} />
      <Header 
        view={view}
        onGoHome={handleGoHome}
        onShowSubjects={handleShowSubjects}
        onShowAuthors={handleShowAuthors}
        onShowAbout={handleShowAbout} 
      />
      
      <main className="flex-grow">
        {renderMainContent()}
      </main>

      <Footer onShowTerms={handleShowTerms} onShowPrivacy={handleShowPrivacy} />
      
      {selectedBookDetails && selectedBookSearchResult && (
        <BookDetailModal 
          bookDetails={selectedBookDetails} 
          bookSearchResult={selectedBookSearchResult}
          onClose={handleCloseModal}
          onSelectSubject={handleSelectSubject}
          baseMetadata={{ view, searchQuery, subjectTitle: selectedSubject?.title }}
        />
      )}
      
      {selectedAuthor && (
        <AuthorDetailModal
            author={selectedAuthor}
            onClose={() => setSelectedAuthor(null)}
            baseMetadata={{ view, searchQuery, subjectTitle: selectedSubject?.title }}
        />
      )}
    </div>
  );
};

export default App;
