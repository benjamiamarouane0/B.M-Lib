import React from 'react';

interface FooterProps {
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms, onShowPrivacy }) => {
  return (
    <footer className="bg-[#2D2D2D] text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center text-sm space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl text-blue-400">B.M Lib</div>
            <span className="text-center md:text-left">
              © 2025 B.M Lib
              <br />
              All rights reserved.
            </span>
          </div>
          <span className="hidden md:inline text-gray-500">|</span>
          <div className="flex items-center gap-4">
            <button onClick={onShowTerms} className="hover:text-white transition-colors">Terms and conditions</button>
            <span className="text-gray-500">|</span>
            <button onClick={onShowPrivacy} className="hover:text-white transition-colors">Privacy and Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);