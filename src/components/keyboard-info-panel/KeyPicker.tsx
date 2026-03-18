import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { useKeymapService } from '../../features/keymap';
import { getKeyPickerCategories } from '../../utils/key-categories';
import { LanguageIcon } from '../ui/LanguageIcon';

interface KeyPickerProps {
    onClose: () => void;
    onSelect: (code: string) => void;
}

export const KeyPicker: React.FC<KeyPickerProps> = ({ onClose, onSelect }) => {
    const { geometry, os, language } = useKeymapService();
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const categories = useMemo(() => 
        getKeyPickerCategories(geometry, os, language), 
    [geometry, os, language]);

    const filteredCategories = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return categories;
        return categories.map(cat => ({
            ...cat,
            items: cat.items.filter(item => 
                item.label.toLowerCase().includes(q) || 
                item.description.toLowerCase().includes(q) ||
                item.code.toLowerCase().includes(q)
            )
        })).filter(cat => cat.items.length > 0);
    }, [categories, search]);

    const toggleGroup = (name: string) => {
        setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div 
            ref={containerRef}
            className="absolute top-0 right-[calc(100%+2rem)] w-[480px] h-[600px] flex flex-col bg-card border border-border rounded-[var(--radius-panel)] z-[5000] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={ev => ev.stopPropagation()}
        >
            {/* Search Header */}
            <div className="p-4 border-b border-border bg-black/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LanguageIcon className="w-5 h-5 text-accent" />
                        <h3 className="font-mono text-sm text-accent uppercase tracking-wider">Select Key Action</h3>
                    </div>
                    <div className="text-muted opacity-40">
                        <kbd className="font-sans text-[10px]">ESC to close</kbd>
                    </div>
                </div>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search keys..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-border rounded-[var(--radius-input)] px-4 py-2.5 font-mono text-sm text-text outline-none focus:border-accent/50 focus:bg-black/60 transition-all"
                    />
                </div>
            </div>

            {/* Content Overflow Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map(group => {
                        const isExpanded = search ? true : !!expanded[group.name];
                        return (
                            <div key={group.name} className="flex flex-col mb-1 last:mb-0">
                                <button 
                                    className={`
                                        flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all text-left
                                        ${isExpanded ? 'text-text opacity-100' : 'text-muted/60 opacity-60 hover:opacity-100 hover:bg-white/5 hover:text-accent'}
                                    `}
                                    onClick={() => toggleGroup(group.name)}
                                >
                                    <span className={`text-[9px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                                    <span>{group.name}</span>
                                </button>
                                
                                {isExpanded && (
                                    <div className="grid grid-cols-5 gap-2 p-2 pt-0">
                                        {group.items.map(k => (
                                            <button 
                                                key={k.code} 
                                                className="group relative flex flex-col items-center justify-center aspect-[1.2/1] bg-card border border-white/5 rounded-[var(--round)] p-1.5 transition-all hover:border-white hover:scale-[1.04] active:scale-95 z-10" 
                                                onClick={() => { onSelect(k.code); onClose(); }}
                                            >
                                                <div className="text-[14px] font-bold leading-none mb-1 text-text group-hover:text-white transition-colors">{k.label}</div>
                                                <div className="text-[7px] text-muted opacity-60 group-hover:opacity-100 text-center uppercase tracking-tighter line-clamp-2 transition-all">
                                                    {k.description.split(';')[0]}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted/40 py-20 italic text-sm">
                        No matches for "{search}"
                    </div>
                )}
            </div>
        </div>
    );
};
