import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';

interface FooterProps {
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  onShowContact: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms, onShowPrivacy, onShowContact }) => {
  return (
    <footer className="bg-[#2D2D2D] text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <div className="font-bold text-2xl text-blue-400 mb-1">B.M Lib</div>
            <p className="text-sm">
              © 2025 B.M Lib. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center text-sm gap-x-4 gap-y-2">
            <button onClick={onShowTerms} className="hover:text-white transition-colors">Terms</button>
            <span className="hidden sm:inline text-gray-500">|</span>
            <button onClick={onShowPrivacy} className="hover:text-white transition-colors">Privacy</button>
            <span className="hidden sm:inline text-gray-500">|</span>
            <button onClick={onShowContact} className="hover:text-white transition-colors">Reach Out</button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="font-semibold text-sm">Follow us</p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/in/b-marouane-5aaa4a31b" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <LinkedInIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);