import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButton: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-[60] flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-white/30 active:scale-90 transition-all duration-300 group overflow-hidden"
            aria-label="Go back"
        >
            {/* Liquid-like background overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800 group-hover:text-black transition-colors relative z-10"
            >
                <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};
