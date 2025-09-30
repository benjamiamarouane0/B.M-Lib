import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getRecentChanges } from '../services/openLibraryService';
import { RecentChange, BookSearchResult, AuthorSearchResult } from '../types';
import ChangeCard, { ChangeSubject } from './ChangeCard';
import Spinner from './Spinner';
import { getBookDetails, getAuthorDetails } from '../services/openLibraryService';

interface ActivityFeedProps {
    onSelectBook: (book: BookSearchResult) => void;
    onSelectAuthor: (author: AuthorSearchResult) => void;
}

type EnrichedChange = Omit<RecentChange, 'author'> & {
    author: { key: string } | null;
    subject: ChangeSubject | null;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ onSelectBook, onSelectAuthor }) => {
    const [changes, setChanges] = useState<EnrichedChange[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [showBots, setShowBots] = useState(true);
    
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchSubjectDetails = useCallback(async (change: RecentChange): Promise<ChangeSubject | null> => {
        const primaryChange = change.changes[0];
        if (!primaryChange || !primaryChange.key) return null;

        try {
            if (primaryChange.key.startsWith('/books/') || primaryChange.key.startsWith('/works/')) {
                const details = await getBookDetails(primaryChange.key);
                if (!details || !details.key) { // Defensive check
                    console.warn(`Could not retrieve valid book details for ${primaryChange.key}`);
                    return null;
                }
                const book: BookSearchResult = {
                    key: details.key,
                    title: details.title,
                    // Use optional chaining for safety against malformed author data
                    author_key: details.authors?.map(a => a?.author?.key?.replace('/authors/', '')).filter(Boolean) as string[],
                };
                return book;
            } else if (primaryChange.key.startsWith('/authors/')) {
                const authorKey = primaryChange.key.replace('/authors/', '');
                const details = await getAuthorDetails(authorKey);
                if (!details || !details.name) { // Defensive check
                    console.warn(`Could not retrieve valid author details for ${authorKey}`);
                    return null;
                }
                 const author: AuthorSearchResult = {
                    key: authorKey,
                    name: details.name,
                    work_count: 0 // Not available from this endpoint
                };
                return author;
            }
        } catch (err) {
            console.error(`Failed to fetch details for ${primaryChange.key}`, err);
        }

        return null;
    }, []);


    const fetchChanges = useCallback(async (currentOffset: number) => {
        setLoading(true);
        setError(null);
        try {
            const newChanges = await getRecentChanges({ limit: 50, offset: currentOffset, bot: showBots ? undefined : false });
            if (newChanges.length === 0) {
                setHasMore(false);
                return;
            }
            
            const enriched = await Promise.all(newChanges.map(async (change) => {
                const subject = await fetchSubjectDetails(change);
                return { ...change, subject };
            }));

            setChanges(prev => currentOffset === 0 ? enriched : [...prev, ...enriched]);

        } catch (err) {
            setError('Failed to load activity feed. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [showBots, fetchSubjectDetails]);

    useEffect(() => {
        setChanges([]);
        setOffset(0);
        setHasMore(true);
        fetchChanges(0);
    }, [showBots]);

    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prevOffset => prevOffset + 50);
                 // We don't call fetchChanges here anymore to avoid duplicate calls.
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);
    
    // This effect handles fetching more data when offset changes.
    useEffect(() => {
        if (offset > 0) {
            fetchChanges(offset);
        }
    }, [offset]);


    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Activity Feed</h1>
                 <div className="flex items-center space-x-2">
                    <label htmlFor="show-bots" className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Include Bots
                    </label>
                    <button
                        role="switch"
                        aria-checked={showBots}
                        onClick={() => setShowBots(!showBots)}
                        className={`${
                        showBots ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                        <span
                        className={`${
                            showBots ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                </div>
            </div>
            
            <div className="space-y-4">
                {changes.map((change, index) => {
                     if (changes.length === index + 1) {
                        return (
                            <div ref={lastElementRef} key={change.id}>
                                <ChangeCard change={change} onSelectBook={onSelectBook} onSelectAuthor={onSelectAuthor} />
                            </div>
                        );
                     }
                     return <ChangeCard key={change.id} change={change} onSelectBook={onSelectBook} onSelectAuthor={onSelectAuthor} />;
                })}
            </div>
            
            {loading && (
                <div className="text-center py-10">
                    <Spinner className="h-8 w-8 mx-auto" />
                </div>
            )}

            {!loading && !hasMore && changes.length > 0 && (
                <p className="text-center text-slate-500 py-10">You've reached the end of the activity.</p>
            )}

            {!loading && changes.length === 0 && (
                 <p className="text-center text-slate-500 py-20">No recent activity found matching your criteria.</p>
            )}

            {error && (
                <p className="text-center text-red-500 py-10">{error}</p>
            )}
        </div>
    );
};

export default ActivityFeed;