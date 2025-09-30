import { SearchResponse, BookDetails, AuthorDetails, BookSearchResult, EditionSummary, ReadingLogResponse, AuthorSearchResponse, AuthorWorksResponse, AuthorWork, SubjectResponse, ArchiveMetadata, InsideSearchResponse, ReadApiResponse, RecentChange, ListSearchResponse, ListSeedsResponse, HistoryEntry, SortOrder } from '../types';

const API_BASE_URL = 'https://openlibrary.org';

export const searchBooks = async (query: string, startYear?: string, endYear?: string): Promise<SearchResponse> => {
  if (!query) return { docs: [], numFound: 0 };

  let finalQuery = query;
  const start = startYear?.trim();
  const end = endYear?.trim();

  if (start || end) {
      const yearFilter = `publish_year:[${start || '*'} TO ${end || '*'}]`;
      finalQuery = `${query.trim()} AND ${yearFilter}`;
  }

  try {
    const fields = [
      'key', 'title', 'author_name', 'cover_i', 'first_publish_year', 'author_key', 'ia',
      'edition_key',
    ].join(',');

    const response = await fetch(`${API_BASE_URL}/search.json?q=${encodeURIComponent(finalQuery)}&fields=${fields}&limit=24`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: SearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to search books:', error);
    throw error;
  }
};

export const searchAuthors = async (query: string): Promise<AuthorSearchResponse> => {
  if (!query) return { docs: [], numFound: 0 };
  try {
    const response = await fetch(`${API_BASE_URL}/search/authors.json?q=${encodeURIComponent(query)}&limit=20`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: AuthorSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to search authors:', error);
    throw error;
  }
};

export const getSubject = async (subject: string): Promise<SubjectResponse> => {
  const formattedSubject = subject.toLowerCase().replace(/ /g, '_');
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${formattedSubject}.json?details=true&limit=20`);
     if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: SubjectResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch subject ${subject}:`, error);
    throw error;
  }
};


export const getBooksBySubject = async (subject: string, sort: SortOrder = 'random', limit: number = 12): Promise<BookSearchResult[]> => {
  try {
    const fields = [
      'key', 'title', 'author_name', 'cover_i', 'first_publish_year', 'author_key', 'ia', 'edition_key'
    ].join(',');
    const response = await fetch(`${API_BASE_URL}/search.json?q=subject:"${encodeURIComponent(subject.toLowerCase())}"&fields=${fields}&limit=${limit}&sort=${sort}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: SearchResponse = await response.json();
    return data.docs;
  } catch (error) {
    console.error(`Failed to fetch books for subject ${subject}:`, error);
    return [];
  }
};

export const getBookDetails = async (workId: string): Promise<BookDetails | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${workId}.json`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Book details not found for ${workId}`);
        return null;
      }
      throw new Error('Network response was not ok');
    }
    const data: BookDetails = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch book details for ${workId}:`, error);
    throw error;
  }
};

export const getAuthorDetails = async (authorId: string): Promise<AuthorDetails | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/authors/${authorId}.json`);
     if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Author details not found for ${authorId}`);
        return null;
      }
      throw new Error('Network response was not ok');
    }
    const data: AuthorDetails = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch author details for ${authorId}:`, error);
    throw error;
  }
}

export const getAuthorWorks = async (authorKey: string): Promise<AuthorWork[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/authors/${authorKey}/works.json?limit=50`);
    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`Works not found for author ${authorKey}`);
            return [];
        }
        throw new Error('Network response was not ok');
    }
    const data: AuthorWorksResponse = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error(`Failed to fetch works for author ${authorKey}:`, error);
    return [];
  }
};

type CoverIdentifiers = {
  id?: number;
  isbn?: string;
  olid?: string;
};

export const getCoverUrl = (identifiers: CoverIdentifiers, size: 'S' | 'M' | 'L' = 'L'): string => {
  if (identifiers.isbn) {
    return `https://covers.openlibrary.org/b/isbn/${identifiers.isbn}-${size}.jpg`;
  }
  if (identifiers.olid) {
    return `https://covers.openlibrary.org/b/olid/${identifiers.olid}-${size}.jpg`;
  }
  if (identifiers.id) {
    return `https://covers.openlibrary.org/b/id/${identifiers.id}-${size}.jpg`;
  }
  return `https://picsum.photos/320/480?grayscale&blur=1`;
};

type AuthorPhotoIdentifiers = {
  id?: number;
  olid?: string;
};

export const getAuthorPhotoUrl = (identifiers: AuthorPhotoIdentifiers, size: 'S' | 'M' | 'L' = 'M'): string => {
  // Prefer OLID as it is a more direct identifier for an author
  if (identifiers.olid) {
    return `https://covers.openlibrary.org/a/olid/${identifiers.olid}-${size}.jpg`;
  }
  if (identifiers.id) {
    return `https://covers.openlibrary.org/a/id/${identifiers.id}-${size}.jpg`;
  }
  return `https://picsum.photos/200/200?grayscale`;
};

interface WorkEditionsResponse {
  entries: EditionSummary[];
}

export const getWorkEditions = async (workKey: string): Promise<EditionSummary[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${workKey}/editions.json?limit=24&sort=new`);
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Editions not found for work ${workKey}`);
          return [];
      }
      throw new Error('Network response was not ok');
    }
    const data: WorkEditionsResponse = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error(`Failed to fetch editions for ${workKey}:`, error);
    return [];
  }
};

export type Shelf = 'want-to-read' | 'currently-reading' | 'already-read';

export const getUserShelf = async (username: string, shelf: Shelf): Promise<BookSearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/people/${username}/books/${shelf}.json`);
    if (!response.ok) {
      throw new Error(`Could not fetch shelf for user ${username}. User may not exist or shelves may be private.`);
    }
    const data: ReadingLogResponse = await response.json();
    return data.reading_log_entries.map(entry => entry.work);
// FIX: Corrected a syntax error in the catch block.
  } catch (error) {
    console.error(`Failed to fetch shelf ${shelf} for ${username}:`, error);
    throw error;
  }
};

// Internet Archive Services
export const getArchiveMetadata = async (identifier: string): Promise<ArchiveMetadata> => {
  try {
    const response = await fetch(`https://archive.org/metadata/${identifier}`);
    if (!response.ok) {
      throw new Error('Network response was not ok for archive metadata');
    }
    const data = await response.json();
    if (!data.server || !data.dir) {
      throw new Error('Invalid metadata received from archive.org');
    }
    return { server: data.server, dir: data.dir };
  } catch (error) {
    console.error(`Failed to fetch archive metadata for ${identifier}:`, error);
    throw error;
  }
};

export const searchInsideBook = async (
  hostname: string,
  path: string,
  doc: string,
  query: string
): Promise<InsideSearchResponse> => {
  try {
    const url = `https://${hostname}/fulltext/inside.php?item_id=${doc}&doc=${doc}&path=${path}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok for inside search');
    }
    let text = await response.text();
    // Handle JSONP "reply(...)" format
    if (text.startsWith('reply(') && text.endsWith(')')) {
      text = text.substring(6, text.length - 1);
    }
    const data: InsideSearchResponse = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Failed to search inside book:', error);
    throw error;
  }
};

// Open Library Read API
export const getReadability = async (
  type: 'isbn' | 'lccn' | 'oclc' | 'olid',
  value: string
): Promise<ReadApiResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/volumes/brief/${type}/${value}.json`);
    if (!response.ok) {
      if (response.status === 404) return null; // No record found is not an error
      throw new Error('Network response was not ok for Read API');
    }
    const data = await response.json();
    if (Object.keys(data).length === 0 || !data.records || !data.items) {
      return null; // Empty response means no readable version
    }
    return data as ReadApiResponse;
  } catch (error) {
    console.error(`Failed to fetch readability for ${type} ${value}:`, error);
    throw error;
  }
};

// Recent Changes API
export interface RecentChangesOptions {
  limit?: number;
  offset?: number;
  bot?: boolean;
}

export const getRecentChanges = async (options: RecentChangesOptions = {}): Promise<RecentChange[]> => {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', String(options.limit));
  if (options.offset) params.set('offset', String(options.offset));
  if (options.bot !== undefined) params.set('bot', String(options.bot));

  const url = `${API_BASE_URL}/recentchanges.json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: RecentChange[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch recent changes:', error);
    throw error;
  }
};

// Lists API
export const searchLists = async (query: string): Promise<ListSearchResponse> => {
    if (!query) return { docs: [], start: 0 };
    try {
        const response = await fetch(`${API_BASE_URL}/search/lists.json?q=${encodeURIComponent(query)}&limit=24`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ListSearchResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to search lists:', error);
        throw error;
    }
};

export const getListSeeds = async (listUrl: string): Promise<ListSeedsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}${listUrl}/seeds.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ListSeedsResponse = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch seeds for list ${listUrl}:`, error);
        throw error;
    }
};

// History API
export const getEntityHistory = async (entityKey: string): Promise<HistoryEntry[]> => {
    try {
        const url = `${API_BASE_URL}${entityKey}/history.json?limit=50`;
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`History not found for ${entityKey}`);
                return [];
            }
            throw new Error('Network response was not ok');
        }
        const data: HistoryEntry[] = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch history for ${entityKey}:`, error);
        throw error;
    }
};
