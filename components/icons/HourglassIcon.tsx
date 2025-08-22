
import React from 'react';

const HourglassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.234-4.266-9.5-9.5-9.5S.5 6.766.5 12s4.266 9.5 9.5 9.5 9.5-4.234 9.5-9.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75l-9 10.5M7.5 6.75l9 10.5" />
    </svg>
);

export default HourglassIcon;
