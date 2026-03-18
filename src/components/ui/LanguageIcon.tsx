import React from 'react';

interface LanguageIconProps {
    className?: string;
}

export const LanguageIcon: React.FC<LanguageIconProps> = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <defs>
            <filter 
                id="language-neon-glow" 
                filterUnits="userSpaceOnUse" 
                x="-20" y="-20" width="80" height="80"
            >
                {/* Layer 1: Atmospheric Bloom (Lavender) */}
                <feGaussianBlur stdDeviation="3" in="SourceGraphic" result="bloom" />
                <feColorMatrix in="bloom" type="matrix" 
                    values="0 0 0 0 0.62  
                            0 0 0 0 0.61  
                            0 0 0 0 1.00  
                            0 0 0 0.8 0" result="coloredBloom" />
                
                {/* Layer 2: Sharp Core Glow */}
                <feGaussianBlur stdDeviation="0.8" in="SourceGraphic" result="coreGlow" />
                
                <feMerge>
                    <feMergeNode in="coloredBloom" />
                    <feMergeNode in="coreGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g className="kp-svg-content-group">
            {/* Å: Unified Ring and A-body */}
            <circle cx="10" cy="9" r="3" className="stroke-accent stroke-[3.2] transition-colors duration-300 group-hover:stroke-white" />
            <path d="M4 34 L10 15 L16 34 M7 28 H13" className="stroke-accent stroke-[3.2] transition-colors duration-300 group-hover:stroke-white" />

            {/* Ñ: Unified Tilde and N-body */}
            <path d="M26 9 C 27.5 7, 30.5 11, 32 9" className="stroke-accent stroke-[3.2] transition-colors duration-300 group-hover:stroke-white" />
            <path d="M26 21.5 V13 L32 21.5 V13" className="stroke-accent stroke-[3.2] transition-colors duration-300 group-hover:stroke-white" />

            {/* ㅈ: Unified Korean glyph */}
            <path d="M25 31.5 H35 M30 31.5 L25 38 M30 31.5 L35 38" className="stroke-accent stroke-[3.2] transition-colors duration-300 group-hover:stroke-white" />
        </g>
    </svg>
);
