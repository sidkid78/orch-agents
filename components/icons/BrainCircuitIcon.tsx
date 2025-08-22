
import React from 'react';

const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2a10 10 0 0 0-3.952 19.497M12 2a10 10 0 0 1 3.952 19.497" />
    <path d="M12 2v4" />
    <path d="M12 22v-4" />
    <path d="M22 12h-4" />
    <path d="M6 12H2" />
    <path d="M4.929 4.929l2.828 2.828" />
    <path d="M16.243 16.243l2.828 2.828" />
    <path d="M19.071 4.929l-2.828 2.828" />
    <path d="M7.757 16.243l-2.828 2.828" />
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

export default BrainCircuitIcon;
