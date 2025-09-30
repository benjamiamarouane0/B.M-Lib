import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';
import InfoIcon from './icons/InfoIcon';
import CodeIcon from './icons/CodeIcon';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none">
            {children}
        </div>
    </div>
);


const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                About <span className="text-orange-600 dark:text-orange-400">B.M Lib</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Your elegant gateway to a universe of books, powered by the collective knowledge of the web.
            </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
            <InfoCard icon={<BookOpenIcon className="w-6 h-6 text-indigo-500" />} title="Our Mission">
                <p>
                    At B.M Lib, our mission is to foster a love for reading by making literature more accessible and discoverable. We believe that every book is a new world waiting to be explored. This application provides a beautiful, fast, and intuitive interface to search the vast catalog of the Open Library, helping you find your next great read, learn about your favorite authors, and explore literary subjects with ease.
                </p>
            </InfoCard>

            <InfoCard icon={<CodeIcon className="w-6 h-6 text-purple-500" />} title="The Technology">
                <p>
                    B.M Lib is a modern web application built with cutting-edge technologies to ensure a performant and delightful user experience:
                </p>
                <ul>
                    <li><strong>React:</strong> A JavaScript library for building user interfaces.</li>
                    <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid UI development.</li>
                    <li><strong>Vite:</strong> A next-generation frontend tooling that provides a faster and leaner development experience.</li>
                </ul>
                <p>
                    The combination of these technologies allows for a highly interactive and responsive application that works beautifully on any device.
                </p>
            </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;