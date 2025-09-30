import React from 'react';

interface SubjectsPageProps {
  onSelectSubject: (subject: string) => void;
}

const subjects = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'History', 
  'Biography', 'Science', 'Art', 'Cooking', 'Poetry', 
  'Philosophy', 'Psychology', 'Thriller', 'Horror', 'Children\'s Literature',
  'Comics', 'Business', 'Self-Help', 'Travel', 'Programming'
];

const SubjectsPage: React.FC<SubjectsPageProps> = ({ onSelectSubject }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-400">Explore Subjects</h1>
        <p className="mt-3 text-lg text-yellow-300">
          Click on any subject to discover a world of books.
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => onSelectSubject(subject)}
              className="p-4 text-center font-semibold text-yellow-900 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-all duration-200 ease-in-out border border-yellow-200 dark:border-yellow-800/30"
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;