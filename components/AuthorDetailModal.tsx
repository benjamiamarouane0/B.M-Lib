import React, { useState, useEffect } from 'react';
import { AuthorDetails, AuthorSearchResult, AuthorWork } from '../types';
import { getAuthorDetails, getAuthorPhotoUrl, getAuthorWorks } from '../services/openLibraryService';
import CloseIcon from './icons/CloseIcon';
import Spinner from './Spinner';
import { usePageMetadata, setPageMetadata, BaseMetadata } from '../hooks/usePageMetadata';
import SchemaInjector from './SchemaInjector';

interface AuthorDetailModalProps {
  author: AuthorSearchResult;
  onClose: () => void;
  baseMetadata: BaseMetadata;
}

const AuthorDetailModal: React.FC<AuthorDetailModalProps> = ({ author, onClose, baseMetadata }) => {
  const [details, setDetails] = useState<AuthorDetails | null>(null);
  const [works, setWorks] = useState<AuthorWork[]>([]);
  const [loading, setLoading] = useState(true);

  const bio = details ? (typeof details.bio === 'string' ? details.bio : details.bio?.value) : 'No biography available.';

  // SEO: Update metadata when modal is open
  usePageMetadata('author-details', {
    authorName: details?.name || author.name,
    description: bio,
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
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [authorDetails, authorWorks] = await Promise.all([
          getAuthorDetails(author.key),
          getAuthorWorks(author.key),
        ]);
        setDetails(authorDetails);
        setWorks(authorWorks);
      } catch (error) {
        console.error("Failed to fetch author details or works", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [author.key]);

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

  const renderDetails = () => (
    <>
        <section className="mb-6" aria-labelledby="author-bio-heading">
            <div className="flex items-center gap-2 mb-2">
                <h3 id="author-bio-heading" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Biography</h3>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300">
                    {bio}
                </p>
            </div>
        </section>

        <section aria-labelledby="author-works-heading">
            <div className="flex items-center gap-2 mb-3">
                <h3 id="author-works-heading" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Works ({works.length})</h3>
            </div>
                {works.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {works.map(work => (
                        <li key={work.key} className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <a 
                                href={`https://openlibrary.org${work.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-800 dark:text-slate-200 font-medium"
                            >
                                {work.title}
                                {work.first_publish_year && <span className="text-sm text-slate-500 ml-2">({work.first_publish_year})</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No works found.</p>
            )}
        </section>
    </>
  );

  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": details?.name || author.name,
    "birthDate": details?.birth_date,
    "deathDate": details?.death_date,
    "description": bio.substring(0, 5000),
    "url": `https://openlibrary.org/authors/${author.key}`
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 sm:p-6 md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-name"
    >
      <SchemaInjector schema={authorSchema} />
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

        {loading ? (
            <div className="flex justify-center items-center h-96">
                <Spinner className="w-12 h-12" />
            </div>
        ) : (
            <div className="md:flex">
                <div className="md:w-1/3 flex-shrink-0 p-8 flex flex-col items-center text-center bg-slate-50 dark:bg-slate-800/50">
                    <img
                        src={getAuthorPhotoUrl({ olid: author.key }, 'L')}
                        alt={`Photo of ${author.name}`}
                        className="w-48 h-48 rounded-full object-cover mb-4 ring-4 ring-white dark:ring-slate-700"
                    />
                    <h2 id="author-name" className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{details?.name || author.name}</h2>
                    {(details?.birth_date || details?.death_date) && (
                        <p className="text-md text-slate-500 dark:text-slate-400 mt-1">
                            {details?.birth_date} {details?.death_date ? `– ${details.death_date}` : ''}
                        </p>
                    )}
                    <a 
                        href={`https://openlibrary.org/authors/${author.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        View on Open Library &rarr;
                    </a>
                </div>

                <div className="p-6 md:p-8 flex-grow">
                    {renderDetails()}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDetailModal;
