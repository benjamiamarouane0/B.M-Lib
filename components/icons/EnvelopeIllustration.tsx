import React from 'react';

const EnvelopeIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-hidden="true"
  >
    <g transform="translate(10, 20)">
      {/* <!-- Envelope Back --> */}
      <path d="M10 50 L90 10 L170 50 L170 130 L10 130 Z" fill="#475569" />
      
      {/* <!-- Paper sticking out --> */}
      <path d="M20 60 L160 60 L160 30 L140 20 L40 20 L20 30 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="30" y="35" width="120" height="4" fill="#94A3B8" rx="2" />
      <rect x="30" y="45" width="100" height="4" fill="#94A3B8" rx="2" />
      <rect x="30" y="55" width="120" height="4" fill="#94A3B8" rx="2" />
      <rect x="30" y="65" width="80" height="4" fill="#94A3B8" rx="2" />

      {/* <!-- Envelope Front --> */}
      <path d="M10 55 L90 100 L170 55" fill="#64748B" />
      
      {/* <!-- Decorative element --> */}
      <circle cx="150" cy="40" r="20" fill="#F97316" fillOpacity="0.8"/>
      <circle cx="40" cy="140" r="10" fill="#6366F1" fillOpacity="0.7"/>

      {/* <!-- Subtle shadows --> */}
      <path d="M10 130 L90 85 L170 130 L10 130 Z" fill="black" fillOpacity="0.1" />
    </g>
  </svg>
);

export default EnvelopeIllustration;