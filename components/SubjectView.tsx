import React from 'react';
import { SubjectResponse, SubjectWork, BookSearchResult, AuthorSearchResult } from '../types';

const PublishingHistoryChart: React.FC<{ data: number[][] }> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const relevantData = data.filter(([year]) => year > 1500).slice(-100); // last 100 entries since 1500
    if (relevantData.length === 0) return null;

    const maxCount = Math.max(...relevantData.map(([, count]) => count));
    const minYear = relevantData[0][0];
    const maxYear = relevantData[relevantData.length - 1][0];

    return (
        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="text-md font-semibold mb-2 text-slate-700 dark:text-slate-300">Publishing History ({minYear} - {maxYear})</h4>
            <div className="flex items-end h-32 gap-px">
                {relevantData.map(([year, count]) => (
                    <div key={year} className="flex-1 group relative">
                        <div
                            className="w-full bg-indigo-300 dark:bg-indigo-600 group-hover:bg-indigo-500 transition-all"
                            style={{ height: `${(count / maxCount) * 100}%` }}
                        />
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                            {year}: {count}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface SubjectViewProps {
    details: SubjectResponse;
    onSelectBook: (book: BookSearchResult) => void;
    onSelectAuthor: (author: AuthorSearchResult) => void;
    onSelectSubject: (subject: string) => void;
}

const SubjectView: React.FC<SubjectViewProps> = ({ details, onSelectBook, onSelectAuthor, onSelectSubject }) => {
    
    const handleWorkClick = (work: SubjectWork) => {
        const book: BookSearchResult = {
            key: work.key,
            title: work.title,
            author_name: work.authors.map(a => a.name),
            author_key: work.authors.map(a => a.key.replace('/authors/', '')),
            ia: work.ia_collection,
        };
        onSelectBook(book);
    };

    const handleAuthorClick = (authorKey: string, authorName: string) => {
        const author: AuthorSearchResult = {
            key: authorKey.replace('/authors/', ''),
            name: authorName,
            work_count: 0
        };
        onSelectAuthor(author);
    }
    
    const MetadataSection: React.FC<{title: string, items: {key: string, name: string, count: number}[], onSelect: (key: string, name: string) => void, type: 'author' | 'subject'}> = ({title, items, onSelect, type}) => {
        if (!items || items.length === 0) return null;
        return (
            <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">{title}</h3>
                <div className="flex flex-wrap gap-2">
                    {items.slice(0, 15).map(item => (
                        <button 
                          key={item.key} 
                          onClick={() => onSelect(item.key, item.name)}
                          className="bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
                        >
                            {item.name} <span className="text-xs opacity-70">({item.count})</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-indigo-500 font-semibold">Subject</p>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{details.name}</h1>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mt-2">
                    <span>{details.work_count.toLocaleString()} Works</span>
                    <span>&bull;</span>
                    <span>{details.ebook_count.toLocaleString()} eBooks</span>
                </div>
            </div>

            {details.publishing_history && <PublishingHistoryChart data={details.publishing_history} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Books in this Subject</h3>
                        {details.works && details.works.length > 0 ? (
                           <ul className="space-y-2">
                                {details.works.map(work => (
                                    <li key={work.key}>
                                        <button onClick={() => handleWorkClick(work)} className="w-full text-left p-3 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm">
                                            <p className="font-semibold text-indigo-700 dark:text-indigo-400">{work.title}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{work.authors.map(a => a.name).join(', ')}</p>
                                        </button>
                                    </li>
                                ))}
                           </ul>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 italic">No works found for this subject.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <MetadataSection title="Related Authors" items={details.authors} onSelect={(key, name) => handleAuthorClick(key, name)} type="author" />
                    <MetadataSection title="Related Subjects" items={details.subjects} onSelect={(key, name) => onSelectSubject(name)} type="subject" />
                    
                    {details.publishers && details.publishers.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Top Publishers</h3>
                             <div className="flex flex-wrap gap-2">
                                {details.publishers.slice(0, 10).map(item => (
                                    <span key={item.name} className="bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-200">
                                        {item.name} <span className="text-xs opacity-70">({item.count})</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectView;