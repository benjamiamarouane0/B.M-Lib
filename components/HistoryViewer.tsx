import React, { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';
import { getEntityHistory } from '../services/openLibraryService';
import Spinner from './Spinner';
import HistoryEntryCard from './HistoryEntryCard';

interface HistoryViewerProps {
  entityKey: string;
}

const HistoryViewer: React.FC<HistoryViewerProps> = ({ entityKey }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const historyData = await getEntityHistory(entityKey);
        setHistory(historyData);
      } catch (err) {
        setError('Failed to load revision history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [entityKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
        <span className="ml-2 text-slate-500">Loading history...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (history.length === 0) {
    return <p className="text-center text-slate-500 py-10">No history found for this item.</p>;
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700 -mt-2">
      {history.map((entry) => (
        <HistoryEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default HistoryViewer;