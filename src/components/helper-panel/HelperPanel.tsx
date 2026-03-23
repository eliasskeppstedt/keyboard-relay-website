import { useState, useRef, useEffect } from 'react';
import { useKeymapService, migrateRemapStore } from '../../features/keymap';
import type { OSSelection, RemapStore } from '../../features/keymap/keymap.types';
import JsonEditorModal from '../editor/JsonEditorModal';
import { notify } from '../../features/notifications/notification.service';
import { validateRemapJson } from '../../utils/validation';
import { getAvailableOS, getAvailableStandards, getKeyboardsByStandard, type StandardFilter } from '../../features/keymap/keyboards.config';
import LanguagePicker from './LanguagePicker';

export default function HelperPanel() {
    const { 
        os, setOS, 
        standard, setStandard,
        geometry, setGeometry,
        layoutName, setLayoutName,
        remapStore,
        getLayoutName
    } = useKeymapService();
    
    // We'll need a way to set the whole store
    const setRemapStore = (data: RemapStore) => useKeymapService.setState({ remapStore: data });
    
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const availableOS = getAvailableOS();
    const availableStandards = getAvailableStandards();
    const keyboardsForStandard = getKeyboardsByStandard(standard as StandardFilter);

    // Auto-select first keyboard when standard changes
    useEffect(() => {
        if (keyboardsForStandard.length > 0) {
            const currentKbExists = keyboardsForStandard.some(kb => kb.id === geometry);
            if (!currentKbExists) {
                setGeometry(keyboardsForStandard[0].id);
            }
        }
    }, [standard, keyboardsForStandard, geometry, setGeometry]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Security: reject files larger than 1 MB to prevent browser freeze
        const MAX_SIZE_BYTES = 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            notify.error('File is too large. Maximum allowed size is 1 MB.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Security: validate MIME type at runtime (the `accept` attribute is only a UI hint)
        if (file.type && file.type !== 'application/json' && file.type !== 'text/plain') {
            notify.error('Invalid file type. Only JSON files are accepted.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const validation = validateRemapJson(json);
                if (!validation.isValid) {
                    notify.error(validation.error || 'JSON file does not comply with remap structure');
                    return;
                }

                const hasExistingMappings = remapStore?.remaps?.layers?.some((l) => (l.keys?.length ?? 0) > 0);
                const performUpload = () => {
                    let finalJson = json as RemapStore;
                    let fileOs = finalJson.remaps?.config?.os as OSSelection | undefined;
                    
                    if (!fileOs) {
                        // Heuristic: Check for common Windows-only VK codes
                        const allKeys = finalJson.remaps?.layers?.flatMap(l => l.keys || []) || [];
                        const hasWinCodes = allKeys.some(k => 
                            k.vkCode === 160 || k.vkCode === 162 || k.vkCode === 164 || k.vkCode === 91 ||
                            k.actions?.some(a => a.press?.vkCode === 160 || a.press?.vkCode === 162 || a.press?.vkCode === 164 || a.press?.vkCode === 91)
                        );
                        if (hasWinCodes) fileOs = 'WINDOWS';
                    }

                    if (fileOs && fileOs !== os) {
                        // Migration needed
                        finalJson = migrateRemapStore(finalJson, fileOs, os, geometry);
                        notify.info(`Migrated keymap from ${fileOs} to ${os}`);
                    }

                    // Always ensure extras array is present
                    if (!finalJson.remaps) finalJson.remaps = { layers: [], config: {}, extras: [] };
                    if (!finalJson.remaps.extras) finalJson.remaps.extras = [];

                    setRemapStore(finalJson);
                    notify.success('Keymap uploaded successfully');
                };

                if (hasExistingMappings) {
                    notify.confirm('Do you want to overwrite current mapping with uploaded mapping?', [
                        { label: 'Yes', primary: true, callback: performUpload },
                        { label: 'No', callback: () => notify.info('Upload cancelled') }
                    ]);
                } else {
                    performUpload();
                }
            } catch {
                notify.error('Failed to parse JSON file');
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    return (
        <div className="kbd-panel w-full flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 py-5 sm:py-6 relative z-20">
            <div className="flex flex-col gap-6 w-full min-w-0">
                <div className="flex flex-row items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-mono text-text shrink-0">Layout</h2>
                    <span className="text-muted/60 font-mono text-xl opacity-50 shrink-0">:</span>
                    <input 
                        type="text"
                        value={layoutName}
                        onChange={(e) => setLayoutName(e.target.value)}
                        className="bg-transparent border-none text-text font-mono text-xl sm:text-2xl outline-none focus:ring-0 w-full hover:bg-white/10 rounded-md px-2 py-1 -ml-1 transition-all cursor-text placeholder:text-muted/30 truncate max-w-lg"
                        placeholder="My Remap"
                    />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-4 xl:gap-x-8">
                    {/* LANGUAGE FIRST */}
                    <LanguagePicker />

                    {/* OS SECOND */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="os-select" className="text-muted text-[10px] font-mono uppercase tracking-widest opacity-70">OS</label>
                        <select 
                            id="os-select"
                            value={os} 
                            onChange={(e) => setOS(e.target.value as OSSelection)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-sm sm:text-base outline-none cursor-pointer hover:border-accent/40 transition-colors w-full"
                        >
                            {availableOS.map(o => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    </div>

                    {/* STANDARD THIRD */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="standard-select" className="text-muted text-[10px] font-mono uppercase tracking-widest opacity-70">Standard</label>
                        <select 
                            id="standard-select"
                            value={standard} 
                            onChange={(e) => setStandard(e.target.value as StandardFilter)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-sm sm:text-base outline-none cursor-pointer hover:border-accent/40 transition-colors w-full"
                        >
                            {availableStandards.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* KEYBOARD FOURTH */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="kb-select" className="text-muted text-[10px] font-mono uppercase tracking-widest opacity-70">Choose keyboard</label>
                        <select 
                            id="kb-select"
                            value={geometry} 
                            onChange={(e) => setGeometry(e.target.value)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-sm sm:text-base outline-none cursor-pointer hover:border-accent/40 transition-colors w-full"
                        >
                            {keyboardsForStandard.map(kb => (
                                <option key={kb.id} value={kb.id}>{kb.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center gap-3 xl:pb-1 w-full xl:w-auto xl:justify-end shrink-0 pt-3 xl:pt-0 border-t border-border/30 xl:border-none">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />
                <button onClick={() => fileInputRef.current?.click()} className="nav-button px-4 sm:px-5 py-2 sm:py-2.5 flex-1 sm:flex-initial text-sm sm:text-base whitespace-nowrap">
                    Upload JSON
                </button>
                <button 
                    onClick={() => {
                        if (!remapStore) return;
                        const blob = new Blob([JSON.stringify(remapStore, null, 4)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${getLayoutName()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="nav-button px-4 sm:px-5 py-2 sm:py-2.5 flex-1 sm:flex-initial text-sm sm:text-base whitespace-nowrap"
                >
                    Download JSON
                </button>
                <button 
                    onClick={() => setIsEditorOpen(true)}
                    className="nav-button px-4 sm:px-5 py-2 sm:py-2.5 flex-1 sm:flex-initial text-sm sm:text-base whitespace-nowrap"
                >
                    View JSON
                </button>
            </div>

            <JsonEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
        </div>
    );
}
