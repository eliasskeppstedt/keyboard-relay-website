import { useState, useRef } from 'react';
import { useKeymapService, migrateRemapStore } from '../../features/keymap';
import type { LanguageSelection, OSSelection, RemapStore } from '../../features/keymap/keymap.types';
import JsonEditorModal from '../editor/JsonEditorModal';
import { notify } from '../../features/notifications/notification.service';
import { validateRemapJson } from '../../utils/validation';
import { getAvailableOS, getAvailableStandards, getKeyboardsByStandard, type StandardFilter } from '../../features/keymap/keyboards.config';

export default function HelperPanel() {
    const { 
        language, setLanguage, 
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
    const layoutSlug = getLayoutName();

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

    const handleDownload = () => {
        if (!remapStore) return;
        const blob = new Blob([JSON.stringify(remapStore, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${layoutSlug}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="kbd-panel w-full flex flex-row justify-between items-end gap-12 overflow-hidden py-4">
            <div className="flex flex-col gap-4 shrink-0 grow">
                <div className="flex flex-row items-center gap-3">
                    <h2 className="text-2xl font-mono text-text">Layout</h2>
                    <span className="text-muted/60 font-mono text-xl opacity-50">:</span>
                    <input 
                        type="text"
                        value={layoutName}
                        onChange={(e) => setLayoutName(e.target.value)}
                        className="bg-transparent border-none text-text font-mono text-2xl outline-none focus:ring-0 w-full hover:bg-white/5 rounded-md px-3 py-1 -ml-1 transition-all cursor-text placeholder:text-muted/30"
                        placeholder="My Remap"
                    />
                </div>
                <div className="flex flex-row items-center gap-6">
                    {/* LANGUAGE FIRST */}
                    <div className="flex flex-col gap-2 w-40 shrink-0">
                        <label htmlFor="lang-select" className="text-muted text-[11px] font-mono uppercase tracking-widest opacity-80">Language</label>
                        <select 
                            id="lang-select"
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value as LanguageSelection)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-base outline-none cursor-pointer hover:border-accent/50 transition-colors w-full"
                        >
                            <option value="swedish">Swedish</option>
                            <option value="english">English</option>
                        </select>
                    </div>

                    {/* OS SECOND */}
                    <div className="flex flex-col gap-2 w-40 shrink-0">
                        <label htmlFor="os-select" className="text-muted text-[11px] font-mono uppercase tracking-widest opacity-80">OS</label>
                        <select 
                            id="os-select"
                            value={os} 
                            onChange={(e) => setOS(e.target.value as OSSelection)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-base outline-none cursor-pointer hover:border-accent/50 transition-colors w-full"
                        >
                            {availableOS.map(o => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    </div>

                    {/* STANDARD THIRD */}
                    <div className="flex flex-col gap-2 w-40 shrink-0">
                        <label htmlFor="standard-select" className="text-muted text-[11px] font-mono uppercase tracking-widest opacity-80">Standard</label>
                        <select 
                            id="standard-select"
                            value={standard} 
                            onChange={(e) => setStandard(e.target.value as StandardFilter)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-base outline-none cursor-pointer hover:border-accent/50 transition-colors w-full"
                        >
                            {availableStandards.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* KEYBOARD FOURTH */}
                    <div className="flex flex-col gap-2 grow max-w-xl">
                        <label htmlFor="kb-select" className="text-muted text-[11px] font-mono uppercase tracking-widest opacity-80">Choose keyboard</label>
                        <select 
                            id="kb-select"
                            value={geometry} 
                            onChange={(e) => setGeometry(e.target.value)}
                            className="bg-card text-text border border-border px-3 py-2 rounded-[var(--radius-input)] font-mono text-base outline-none cursor-pointer hover:border-accent/50 transition-colors w-full"
                        >
                            {keyboardsForStandard.map(kb => (
                                <option key={kb.id} value={kb.id}>{kb.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center gap-3 pb-1 -mb-1">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />
                <button onClick={() => fileInputRef.current?.click()} className="nav-button px-5 py-2.5 shrink-0 text-base">
                    Upload JSON
                </button>
                <button onClick={handleDownload} className="nav-button px-5 py-2.5 shrink-0 text-base">
                    Download JSON
                </button>
                <button onClick={() => setIsEditorOpen(true)} className="nav-button px-5 py-2.5 shrink-0 text-base">
                    View JSON
                </button>
            </div>

            <JsonEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
        </div>
    );
}
