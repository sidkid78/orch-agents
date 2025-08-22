
import React from 'react';

const GearsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 6V2" />
    <path d="m12 18-3-2-6 3v4h18v-4l-6-3-3 2Z" />
    <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="m19 12-2-3-2 3" />
    <path d="m5 12 2-3 2 3" />
  </svg>
);

export default GearsIcon;
