import { useState, useMemo } from 'react';
import { parseJsonTokens, type Token } from '../../utils/json-syntax';
import { useKeymapService } from '../../features/keymap';

type GenericRecord = Record<string, unknown>;

interface RemapsShape {
    layers?: unknown[];
    config?: GenericRecord;
    extras?: unknown[];
}

interface DataShape {
    remap?: { layers?: unknown[]; config?: GenericRecord; extras?: unknown[] };
    merged?: { remaps?: RemapsShape } & GenericRecord;
    settings?: GenericRecord;
}

interface JsonEditorProps {
    data: DataShape;
    uploadedData?: GenericRecord | null;
    onClearUpload?: () => void;
}

export default function JsonEditor({ data }: JsonEditorProps) {
    const [tab, setTab] = useState<'config'|'layers'|'extras'|'merged'>('layers');

    const content = useMemo<GenericRecord>(() => {
        switch (tab) {
            case 'layers':
                return { layers: data.merged?.remaps?.layers ?? data.remap?.layers ?? [] };
            case 'config':
                return { config: data.merged?.remaps?.config ?? data.settings ?? {} };
            case 'extras':
                return { extras: data.merged?.remaps?.extras ?? [] };
            case 'merged':
                return (data.merged as GenericRecord) ?? {};
        }
    }, [data, tab]);

    // Syntax highlighting core
    const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
    const [activeLine, setActiveLine] = useState<number | null>(null);

    const jsonString = useMemo(() => {
        return JSON.stringify(content, null, 4);
    }, [content]);

    const { tokens, lines } = useMemo(() => parseJsonTokens(jsonString), [jsonString]);

    const handleTokenClick = (token: Token) => {
        if (token.type === 'indent') return;
        setSelectedTokenId(token.id);
        setActiveLine(token.line);
    };

    const selectedToken = useMemo(() => 
        selectedTokenId !== null ? tokens.find(t => t.id === selectedTokenId) : null
    , [selectedTokenId, tokens]);

    const highlightedBracketIds = useMemo(() => {
        if (!selectedToken) return new Set<number>();
        const ids = new Set<number>();

        const isBracket = selectedToken.value === '{' || selectedToken.value === '}' || 
                          selectedToken.value === '[' || selectedToken.value === ']';

        if (isBracket) {
            ids.add(selectedToken.id);
            if (selectedToken.pairIndex !== undefined) {
                ids.add(selectedToken.pairIndex);
            }
        } else {
            if (selectedToken.parentScopeId !== undefined) {
                const openId = selectedToken.parentScopeId;
                const openToken = tokens.find(t => t.id === openId);
                ids.add(openId);
                if (openToken?.pairIndex !== undefined) {
                    ids.add(openToken.pairIndex);
                }
            }
        }
        return ids;
    }, [selectedToken, tokens]);

    // Tailwind Color Mapping for Syntax
    const getTokenColorClass = (type: string) => {
        switch (type) {
            case 'key': return 'text-[#9cdcfe]';
            case 'string': return 'text-[#ce9178]';
            case 'number': return 'text-[#b5cea8]';
            case 'boolean':
            case 'null': return 'text-[#569cd6]';
            case 'punctuation': return 'text-[#d4d4d4]';
            default: return 'text-text';
        }
    };

    const { getLayoutName } = useKeymapService();
    const layoutName = getLayoutName();

    const tabs: Array<{ id: typeof tab, label: string }> = [
        { id: 'layers', label: 'Layers' },
        { id: 'config', label: 'Config' },
        { id: 'extras', label: 'Extras' },
        { id: 'merged', label: `${layoutName}.json` }
    ];

    return (
        <div className="flex flex-col w-full h-full min-h-[500px] bg-card border border-border rounded-[var(--radius-panel)] overflow-hidden">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto bg-bg border-b border-border scrollbar-hide">
                {tabs.map((t) => (
                    <div key={t.id} className="relative group">
                        <button
                            onClick={() => { setTab(t.id); setSelectedTokenId(null); setActiveLine(null); }}
                            className={`px-4 py-3 font-mono text-[13px] whitespace-nowrap transition-colors outline-none h-full flex items-center
                                ${tab === t.id 
                                    ? 'text-accent border-b-[2px] border-accent bg-card' 
                                    : 'text-muted hover:text-text hover:bg-white/5 border-b-[2px] border-transparent'
                                }`}
                        >
                            {t.label}
                        </button>
                    </div>
                ))}
            </div>

            {/* Editor Body */}
            <div 
                className="flex-1 overflow-auto bg-[#1e1e1e] font-mono text-[13px] leading-relaxed py-4 select-text cursor-text"
                onClick={() => { setSelectedTokenId(null); setActiveLine(null); }}
            >
                {lines.map((lineTokens, index) => {
                    const lineNum = index + 1;
                    const isSelectedLine = activeLine === lineNum;

                    let indentSpaces = 0;
                    let contentTokens = lineTokens;
                    if (lineTokens.length > 0 && lineTokens[0].type === 'indent') {
                        indentSpaces = lineTokens[0].value.length;
                        contentTokens = lineTokens.slice(1);
                    }
                    
                    const indentLevels = Math.floor(indentSpaces / 4);

                    return (
                        <div key={index} className={`flex relative min-w-max hover:bg-white/[0.02] ${isSelectedLine ? 'bg-white/[0.06]' : ''}`}>
                            <div className={`w-[50px] pr-[15px] text-right shrink-0 select-none ${isSelectedLine ? 'text-accent font-bold' : 'text-[#5a4b7a]'}`}>
                                {lineNum}
                            </div>
                            <div className="flex-1 flex relative whitespace-pre pl-[10px]">
                                {/* Indentation Guides */}
                                {Array.from({ length: indentLevels }).map((_, i) => (
                                    <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-white/[0.08] pointer-events-none" style={{ left: `${i * 32 + 10}px` }} />
                                ))}
                                
                                <div style={{ paddingLeft: `${indentSpaces * 8}px` }} className="flex">
                                    {contentTokens.map(token => {
                                        const isSelected = selectedTokenId === token.id;
                                        const isBracketHighlight = highlightedBracketIds.has(token.id);
                                        const isSameWord = selectedToken && 
                                                        token.type !== 'punctuation' && 
                                                        token.type !== 'indent' &&
                                                        token.value === selectedToken.value;

                                        return (
                                            <span
                                                key={token.id}
                                                className={`
                                                    cursor-pointer rounded-[2px] px-[1px]
                                                    ${getTokenColorClass(token.type)}
                                                    ${isSelected ? 'bg-white/20' : ''}
                                                    ${isBracketHighlight ? 'bg-[#ff74cf]/20 outline outline-1 outline-[#ff74cf]/50' : ''}
                                                    ${isSameWord && !isSelectedLine ? 'bg-[#9f9cff]/25 outline outline-1 outline-[#9f9cff]/40' : ''} 
                                                `}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTokenClick(token);
                                                }}
                                            >
                                                {token.value}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
