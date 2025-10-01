import React, { useState } from 'react';
import EnvelopeIllustration from './icons/EnvelopeIllustration';
import CopyIcon from './icons/CopyIcon';

const ContactPage: React.FC = () => {
  const userEmail = "benjamiamarouane0@gmail.com";
  const [copyText, setCopyText] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(userEmail).then(() => {
      setCopyText('Copied!');
      setTimeout(() => {
        setCopyText('Copy');
      }, 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyText('Failed');
       setTimeout(() => {
        setCopyText('Copy');
      }, 2000);
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 min-h-full flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Reach <span className="text-orange-600 dark:text-orange-400">Out</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
                  We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to get in touch.
              </p>
              
              <div className="mt-8">
                  <label htmlFor="contact-email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Direct Email</label>
                  <div className="relative flex items-stretch">
                      <a 
                        href={`mailto:${userEmail}`}
                        id="contact-email"
                        className="flex-auto w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-l-lg px-4 py-3 text-slate-700 dark:text-slate-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={`Email ${userEmail}`}
                      >
                        {userEmail}
                      </a>
                      <button 
                        onClick={handleCopy}
                        className="inline-flex items-center px-4 py-3 border-2 border-l-0 border-indigo-600 bg-indigo-600 text-white font-semibold text-lg rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        aria-label="Copy email address to clipboard"
                      >
                        <CopyIcon className="w-5 h-5 mr-2" />
                        {copyText}
                      </button>
                  </div>
              </div>
          </div>
          
          <div className="flex justify-center items-center">
            <EnvelopeIllustration className="w-full h-auto max-w-md" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;