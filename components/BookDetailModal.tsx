import React, { useState, useEffect } from 'react';
import { BookDetails, AuthorDetails, BookSearchResult, ReadApiItem, ReadApiResponse } from '../types';
import { getCoverUrl, getAuthorDetails, getAuthorPhotoUrl, getReadability } from '../services/openLibraryService';
import CloseIcon from './icons/CloseIcon';
import Spinner from './Spinner';
import EyeIcon from './icons/EyeIcon';
import { usePageMetadata, setPageMetadata, BaseMetadata } from '../hooks/usePageMetadata';
import SchemaInjector from './SchemaInjector';

interface BookDetailModalProps {
  bookDetails: BookDetails;
  bookSearchResult: BookSearchResult | null;
  onClose: () => void;
  onSelectSubject: (subject: string) => void;
  baseMetadata: BaseMetadata;
}

const AuthorInfo: React.FC<{ authorId: string }> = ({ authorId }) => {
  const [author, setAuthor] = useState<AuthorDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const authorDetails = await getAuthorDetails(authorId, controller.signal);
        setAuthor(authorDetails);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Failed to fetch author", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchAuthor();
    
    return () => {
        controller.abort();
    };
  }, [authorId]);

  if (loading) return <Spinner />;
  if (!author) return <p className="text-slate-500">Author details not available.</p>;

  const bio = typeof author.bio === 'string' ? author.bio : author.bio?.value;

  return (
    <div className="mt-4 flex items-start space-x-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <img src={getAuthorPhotoUrl({ id: author.photos?.[0], olid: authorId })} alt={author.name} className="w-16 h-16 rounded-full object-cover" />
      <div>
        <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{author.name}</h4>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{bio || 'No biography available.'}</p>
      </div>
    </div>
  );
};

const ReadabilityButton: React.FC<{ readability: ReadApiItem }> = ({ readability }) => {
    let buttonText = "View";
    let isDisabled = false;
    let buttonClass = "bg-indigo-600 hover:bg-indigo-700 text-white";

    switch(readability.status) {
        case 'full access':
            buttonText = 'Read Now';
            break;
        case 'lendable':
            buttonText = 'Borrow Book';
            break;
        case 'checked out':
            buttonText = 'Checked Out';
            isDisabled = true;
            buttonClass = "bg-slate-400 text-slate-100 cursor-not-allowed dark:bg-slate-600 dark:text-slate-300";
            break;
        case 'restricted':
            buttonText = 'Restricted Access';
            isDisabled = true;
            buttonClass = "bg-yellow-500 text-white cursor-not-allowed";
            break;
    }
    
    const Component = isDisabled ? 'div' : 'a';

    return (
        <Component
            href={!isDisabled ? readability.itemURL : undefined}
            target={!isDisabled ? "_blank" : undefined}
            rel={!isDisabled ? "noopener noreferrer" : undefined}
            className={`flex items-center justify-center w-full px-4 py-3 my-4 font-semibold rounded-lg shadow-md transition-colors text-center ${buttonClass}`}
            aria-disabled={isDisabled}
        >
            <EyeIcon className="w-5 h-5 mr-2" />
            {buttonText}
        </Component>
    );
};

const BookDetailModal: React.FC<BookDetailModalProps> = ({ bookDetails, bookSearchResult, onClose, onSelectSubject, baseMetadata }) => {
  const [readability, setReadability] = useState<ReadApiItem | null>(null);
  const [loadingReadability, setLoadingReadability] = useState(true);
  const [readabilityError, setReadabilityError] = useState<string | null>(null);
  const description = typeof bookDetails.description === 'string' ? bookDetails.description : bookDetails.description?.value;

  // SEO: Update metadata when modal is open
  usePageMetadata('book-details', { 
    bookTitle: bookDetails.title, 
    authorName: bookSearchResult?.author_name?.[0],
    description
  });

  // SEO: Revert metadata when modal closes
  useEffect(() => {
    return () => {
      // This cleanup function runs on unmount.
      // Calling setPageMetadata directly avoids the "invalid hook call" error.
      setPageMetadata(baseMetadata.view, {
        searchQuery: baseMetadata.searchQuery,
        subjectTitle: baseMetadata.subjectTitle
      });
    };
  }, [baseMetadata]);


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchExtraData = async () => {
      if (!bookSearchResult) {
        setLoadingReadability(false);
        return;
      }
      
      setLoadingReadability(true);
      setReadability(null);
      setReadabilityError(null);

      const olid = bookSearchResult?.edition_key?.[0];
      const isbn = bookSearchResult?.isbn?.[0];
      const iaId = bookSearchResult?.ia?.[0];

      try {
        let apiResponse: ReadApiResponse | null = null;
  
        if (olid) {
          apiResponse = await getReadability('olid', olid, signal);
        } else if (isbn) {
          apiResponse = await getReadability('isbn', isbn, signal);
        }
        
        if (apiResponse && apiResponse.items.length > 0) {
          setReadability(apiResponse.items[0]);
        } else if (iaId) {
          setReadability({
              match: 'similar',
              status: 'full access',
              itemURL: `https://archive.org/details/${iaId}`,
              fromRecord: '',
              'ol-edition-id': olid || '',
              'ol-work-id': bookDetails.key,
          });
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return; // Request was cancelled, so we do nothing.
        }

        console.error("Readability check API failed. Attempting IA fallback.", error);
        if (iaId) {
            setReadability({
                match: 'similar',
                status: 'full access',
                itemURL: `https://archive.org/details/${iaId}`,
                fromRecord: '',
                'ol-edition-id': olid || '',
                'ol-work-id': bookDetails.key,
            });
        } else {
            setReadabilityError("Could not check book's online availability.");
        }
      } finally {
          if (!signal.aborted) {
            setLoadingReadability(false);
          }
      }
    };

    fetchExtraData();

    return () => {
        controller.abort();
    };
  }, [bookSearchResult, bookDetails.key]);


  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const authorIds = bookDetails.authors?.map(a => a.author.key.replace('/authors/', ''));

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": bookDetails.title,
    "author": bookSearchResult?.author_name?.map(name => ({
      "@type": "Person",
      "name": name
    })),
    "isbn": bookSearchResult?.isbn?.[0],
    "description": description?.substring(0, 5000) || "No description available.",
    "inLanguage": "en"
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 sm:p-6 md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-title"
    >
      <SchemaInjector schema={bookSchema} />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="p-6 md:p-8">
            <div className="md:flex md:space-x-8">
                <div className="md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
                    <img
                        src={getCoverUrl({ id: bookDetails.covers?.[0] })}
                        alt={`Cover for ${bookDetails.title}`}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>

                <div className="md:w-2/3">
                    <div className="mb-2">
                        <h2 id="book-title" className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{bookDetails.title}</h2>
                    </div>
                    
                    {bookDetails.first_publish_date && (
                        <p className="text-md text-slate-500 dark:text-slate-400 mb-4">First published: {bookDetails.first_publish_date}</p>
                    )}

                    {loadingReadability ? (
                    <div className="h-12 my-4 flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-lg px-4">
                        <Spinner className="w-5 h-5"/>
                        <span className="text-sm text-slate-500 ml-3">Checking availability...</span>
                    </div>
                    ) : readabilityError ? (
                        <div className="h-12 my-4 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-lg px-4 text-center">
                            <span className="text-sm text-yellow-800 dark:text-yellow-300">{readabilityError}</span>
                        </div>
                    ) : readability ? (
                        <ReadabilityButton readability={readability} />
                    ) : null}

                    <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <p className="text-slate-700 dark:text-slate-300">
                        {description || "No description available."}
                    </p>
                    </div>
                    
                    {bookDetails.subjects && bookDetails.subjects.length > 0 && (
                    <section className="mb-6" aria-labelledby="subjects-heading">
                        <h3 id="subjects-heading" className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                        {bookDetails.subjects.slice(0, 10).map((subject) => (
                            <button 
                            key={subject} 
                            onClick={() => onSelectSubject(subject)}
                            className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                            >
                            {subject}
                            </button>
                        ))}
                        </div>
                    </section>
                    )}

                    <section aria-labelledby="authors-heading">
                      <h3 id="authors-heading" className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Author(s)</h3>
                      {authorIds && authorIds.length > 0 ? (
                          authorIds.map(id => <AuthorInfo key={id} authorId={id} />)
                      ) : (
                          <p className="text-slate-500">Author information not available.</p>
                      )}
                    </section>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;