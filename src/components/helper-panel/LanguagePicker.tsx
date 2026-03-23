import React, { useState, useRef, useEffect } from 'react';
import { useKeymapService } from '../../features/keymap/keymap.service';
import { LANGUAGES } from '../keyboard/codes/languages';
import type { LanguageSelection } from '../../features/keymap/keymap.types';

export default function LanguagePicker() {
    const { language, setLanguage } = useKeymapService();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredLanguage, setHoveredLanguage] = useState<LanguageSelection | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const availableLanguages = Object.keys(LANGUAGES) as LanguageSelection[];
    
    // Sort logic for display (Primary then alphabetical)
    const primary = ['swedish', 'english'];
    const rest = availableLanguages
        .filter(l => !primary.includes(l))
        .sort((a, b) => a.localeCompare(b));
    
    const allSorted: LanguageSelection[] = [...primary, ...rest] as LanguageSelection[];

    const filteredLanguages = (searchQuery.trim() === '' 
        ? allSorted 
        : allSorted.filter(l => l.toLowerCase().includes(searchQuery.toLowerCase()))) as LanguageSelection[];

    const getLabel = (lang: string) => lang.charAt(0).toUpperCase() + lang.slice(1);

    const handleSelect = (lang: LanguageSelection) => {
        setLanguage(lang);
        setIsOpen(false);
        setSearchQuery('');
        setHoveredLanguage(null);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
                setHoveredLanguage(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const displayLegend = hoveredLanguage 
        ? getLabel(hoveredLanguage) 
        : (isOpen && searchQuery ? searchQuery : getLabel(language));

    return (
        <div className="flex flex-col gap-2 relative w-full" ref={containerRef}>
            <label className="text-muted text-[10px] font-mono uppercase tracking-widest opacity-70">Language</label>
            
            <div 
                className={`
                    flex items-center justify-between px-3 py-2 bg-card border rounded-[var(--radius-input)] font-mono text-sm sm:text-base cursor-pointer transition-all duration-200
                    ${isOpen ? 'border-accent ring-1 ring-accent/20' : 'border-border hover:border-accent/40'}
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="bg-transparent border-none outline-none w-full p-0 text-text placeholder:text-text/50 font-mono text-sm sm:text-base"
                        placeholder="Search language..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setHoveredLanguage(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="text-text truncate">{displayLegend}</span>
                )}
                
                <svg 
                    className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-card border border-border rounded-[var(--radius-input)] shadow-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-1">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang: LanguageSelection, idx) => {
                                const isPrimary = primary.includes(lang);
                                const nextIsRest = isPrimary && idx < filteredLanguages.length - 1 && !primary.includes(filteredLanguages[idx+1]);
                                
                                return (
                                    <React.Fragment key={lang}>
                                        <div
                                            className={`
                                                px-3 py-2 rounded-md font-mono text-sm sm:text-base cursor-pointer transition-colors duration-150
                                                ${language === lang ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-white/5 hover:text-white'}
                                            `}
                                            onMouseEnter={() => setHoveredLanguage(lang)}
                                            onMouseLeave={() => setHoveredLanguage(null)}
                                            onClick={() => handleSelect(lang)}
                                        >
                                            {getLabel(lang)}
                                        </div>
                                        {nextIsRest && searchQuery === '' && (
                                            <div className="h-[1px] bg-border/40 my-1 mx-2" />
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-muted/50 font-mono text-xs italic">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
