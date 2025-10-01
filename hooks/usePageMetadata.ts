import { useEffect } from 'react';

type View = 'home' | 'subject' | 'search' | 'subjects' | 'authors' | 'about' | 'terms' | 'privacy' | 'contact' | 'book-details' | 'author-details';

export interface BaseMetadata {
    view: View;
    searchQuery?: string;
    subjectTitle?: string;
}
interface MetadataOptions extends BaseMetadata {
    bookTitle?: string;
    authorName?: string;
    description?: string;
}

const getPageMetadata = (view: View, options: MetadataOptions): { title: string; description: string } => {
    const siteName = "B.M Lib";
    
    switch (view) {
        case 'home':
            return {
                title: `Welcome to ${siteName} | Explore a Universe of Books`,
                description: "Explore millions of books from the Open Library. Discover new reads, view book details, and learn about authors in a beautifully designed interface.",
            };
        case 'subjects':
            return {
                title: `Explore Subjects | ${siteName}`,
                description: "Browse through a wide variety of literary subjects and genres to find your next great read, from Science Fiction to History.",
            };
        case 'authors':
            return {
                title: `Discover Authors | ${siteName}`,
                description: "Find and learn about your favorite authors, explore their works, and discover new writers.",
            };
        case 'about':
            return {
                title: `About | ${siteName}`,
                description: `Learn about the mission and technology behind ${siteName}, your elegant gateway to a universe of books.`,
            };
        case 'terms':
            return {
                title: `Terms and Conditions | ${siteName}`,
                description: `Read the terms and conditions for using the ${siteName} application.`,
            };
        case 'privacy':
            return {
                title: `Privacy and Policy | ${siteName}`,
                description: `Our commitment to your privacy. Read the privacy policy for the ${siteName} application.`,
            };
        case 'contact':
            return {
                title: `Reach Out | ${siteName}`,
                description: `Get in touch with the team behind ${siteName}. We'd love to hear from you.`,
            };
        case 'search':
            return {
                title: `Search results for "${options.searchQuery}" | ${siteName}`,
                description: `Find books and authors related to your search for "${options.searchQuery}".`,
            };
        case 'subject':
            return {
                title: `${options.subjectTitle} Books | ${siteName}`,
                description: `Discover a collection of books under the subject: ${options.subjectTitle}.`,
            };
        case 'book-details':
            const bookTitle = `${options.bookTitle}${options.authorName ? ` by ${options.authorName}` : ''} | ${siteName}`;
            const bookDescription = options.description ? `${options.description.substring(0, 155)}...` : `Details about the book ${options.bookTitle}.`;
            return { title: bookTitle, description: bookDescription };

        case 'author-details':
            const authorTitle = `${options.authorName} | Author Details | ${siteName}`;
            const authorDescription = options.description ? `${options.description.substring(0, 155)}...` : `Biography and works of the author ${options.authorName}.`;
            return { title: authorTitle, description: authorDescription };

        default:
            return {
                title: siteName,
                description: "An elegant web application to search and explore millions of books from the Open Library.",
            };
    }
};

// Standalone function to set metadata. This can be called from anywhere, including useEffect cleanup functions.
export const setPageMetadata = (view: View, options: Partial<MetadataOptions> = {}) => {
    const { title, description } = getPageMetadata(view, options as MetadataOptions);
    document.title = title;
    const metaDescription = document.querySelector('meta[id="meta-description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    }
};


export const usePageMetadata = (view: View, options: Partial<MetadataOptions> = {}) => {
    // Stringify options to create a stable dependency for useEffect,
    // preventing re-runs on every render if the options object is created inline.
    const optionsKey = JSON.stringify(options);

    useEffect(() => {
        setPageMetadata(view, options);
    }, [view, optionsKey]);

    return;
};