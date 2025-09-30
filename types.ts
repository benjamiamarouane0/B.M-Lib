// FIX: Removed self-import of `EditionSummary` which was causing a declaration conflict.
export interface EditionSummary {
  key: string;
  title: string;
  publish_year?: number[];
  cover_i?: number;
  language?: string[];
  ebook_access?: string;
  isbn?: string[];
}

export interface BookSearchResult {
  key:string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  author_key?: string[];
  ia?: string[];
  editions?: {
    docs: EditionSummary[];
  };
  isbn?: string[];
  edition_key?: string[];
}

export interface SearchResponse {
  docs: BookSearchResult[];
  numFound: number;
}

export interface BookDetails {
  key: string;
  title:string;
  authors: { author: { key: string } }[];
  description?: string | { type: string; value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
}

export interface AuthorDetails {
  name: string;
  bio?: string | { type: string; value: string };
  birth_date?: string;
  death_date?: string;
  photos?: number[];
}

export interface ReadingLogEntry {
  work: BookSearchResult;
  logged_date: string;
}

export interface ReadingLogResponse {
  reading_log_entries: ReadingLogEntry[];
}

export interface AuthorSearchResult {
  key: string;
  name: string;
  birth_date?: string;
  top_work?: string;
  work_count: number;
}

export interface AuthorSearchResponse {
  docs: AuthorSearchResult[];
  numFound: number;
}

export interface AuthorWork {
    key: string;
    title: string;
    first_publish_year?: number;
}

export interface AuthorWorksResponse {
    entries: AuthorWork[];
}

// Types for Subject API
export interface SubjectWorkAuthor {
  key: string;
  name: string;
}

export interface SubjectWork {
  key: string;
  title: string;
  edition_count: number;
  cover_id?: number;
  cover_edition_key?: string;
  subject: string[];
  ia_collection: string[];
  has_fulltext: boolean;
  authors: SubjectWorkAuthor[];
}

interface SubjectMetadata {
    key: string;
    name: string;
    count: number;
}

export interface SubjectResponse {
  key: string;
  name: string;
  subject_type: string;
  work_count: number;
  ebook_count: number;
  works: SubjectWork[];
  authors: SubjectMetadata[];
  publishers: SubjectMetadata[];
  subjects: SubjectMetadata[];
  people: SubjectMetadata[];
  places: SubjectMetadata[];
  times: SubjectMetadata[];
  publishing_history: number[][];
}

// Types for Internet Archive Inside Search
export interface ArchiveMetadata {
  server: string;
  dir: string;
}

export interface InsideSearchMatch {
  text: string;
  par: {
    page: number;
  }[];
}

export interface InsideSearchResponse {
  ia: string;
  q: string;
  page_count: number;
  matches: InsideSearchMatch[];
}

// Types for Open Library Read API
export interface ReadApiItem {
  match: 'exact' | 'similar';
  status: 'full access' | 'lendable' | 'checked out' | 'restricted';
  itemURL: string;
  cover?: { large: string; medium: string; small: string };
  fromRecord: string;
  'ol-edition-id': string;
  'ol-work-id': string;
  publishDate?: string;
}

export interface ReadApiRecord {
  data: { [key: string]: any };
  isbns?: string[];
  publishDates?: string[];
  recordURL: string;
}

export interface ReadApiResponse {
  items: ReadApiItem[];
  records: {
    [recordKey: string]: ReadApiRecord;
  };
}

// Types for Recent Changes API
export interface ChangeAuthor {
  key: string; // e.g., "/people/mekBot"
}

export interface ChangeItem {
  key: string; // e.g., "/books/OL23747519M"
  revision: number;
}

export interface RecentChange {
  id: string;
  kind: string; // e.g., "add-book"
  timestamp: string;
  comment: string;
  author: ChangeAuthor | null;
  ip: string;
  changes: ChangeItem[];
  data?: { [key: string]: any };
}

// Types for Lists API
export interface ListSearchResultDoc {
  url: string;
  full_url: string;
  name: string;
  last_update: string;
  seed_count: number;
  edition_count: number;
}

export interface ListSearchResponse {
  docs: ListSearchResultDoc[];
  start: number;
}

export interface ListSeed {
  url: string;
  full_url: string;
  type: 'edition' | 'work' | 'author' | 'subject';
  title: string;
  picture?: { url: string };
}

export interface ListSeedsResponse {
  size: number;
  entries: ListSeed[];
}

// Types for History API
export interface HistoryEntry {
  key: string;
  revision: number;
  id: number;
  action: string;
  author: string | null;
  comment: string;
  created: string;
  changes: string; // This is a JSON string
  data: string; // This is a JSON string
}

export type SortOrder = 'new' | 'old' | 'editions' | 'readinglog' | 'want_to_read' | 'random';