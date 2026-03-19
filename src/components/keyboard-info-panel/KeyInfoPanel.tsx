import { useState } from 'react';
import { useKeymapService } from '../../features/keymap';
import { resolveKeyLegend } from '../../utils/key-resolution';
import { KeyPicker } from './KeyPicker';
import { notify } from '../../features/notifications/notification.service';

import { VK_ANSI } from '../keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../keyboard/codes/virtual-keys/jis';

export default function KeyInfoPanel() {
    const { selectedKey, geometry, os, language, setKeyAction, removeKeyAction, remapStore } = useKeymapService();
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    
    const legend = selectedKey ? resolveKeyLegend(selectedKey.code, geometry, os, language, remapStore, false) : '—';

    // Helper to find the current action legend from JSON
    const getActionLegend = () => {
        if (!selectedKey || !remapStore) return '—';
        const layer = remapStore.remaps?.layers?.[0];
        const keyEntry = layer?.keys?.find((k) => k.code === selectedKey.code);
        const vkCodeHex = keyEntry?.actions?.[0]?.press?.vkCode;
        
        if (vkCodeHex === undefined) return '—';
        
        // Match hex back to legend
        let vkcTable = VK_ANSI;
        if (geometry.includes('iso')) vkcTable = VK_ISO;
        else if (geometry.includes('jis')) vkcTable = VK_JIS;
        
        const match = Object.values(vkcTable).find(v => (os === 'WINDOWS' ? v.windows : v.mac) === vkCodeHex);
        return match?.legend || 'Selected';
    };

    const actionLegend = getActionLegend();

    return (
        <div className="kbd-panel w-64 min-h-[150px] relative">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h2 className="text-sm font-mono text-muted uppercase tracking-wider">Key Info</h2>
                <span className="text-[10px] text-accent/60 italic">{selectedKey ? '' : 'No key selected'}</span>
            </div>
            
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-mono text-muted uppercase">BASE KEY</h3>
                    <div className="bg-bg border border-border rounded-[var(--radius-input)] p-4 flex items-center justify-center font-mono text-lg text-accent">
                        {legend}
                    </div>
                </div>

                {/* Press Action */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-end">
                        <h3 className="text-[10px] font-mono text-muted uppercase">PRESS</h3>
                        <span className="text-[10px] text-accent/60 italic">
                            {selectedKey ? (actionLegend === '—' ? 'Pick a key' : 'Key assigned') : 'No character selected'}
                        </span>
                    </div>
                    <div 
                        onClick={() => {
                            if (!selectedKey) {
                                notify.info('Choose a key to select a press action');
                                return;
                            }
                            setIsPickerOpen(true);
                        }}
                        className={`
                            bg-bg border border-border rounded-[var(--radius-input)] relative flex items-center p-1 font-mono text-lg transition-all 
                            ${selectedKey ? 'focus-within:border-accent/40 cursor-pointer hover:border-accent/30 hover:bg-white/5 group' : 'opacity-40'}
                        `}
                    >
                        <button 
                            className={`flex-1 text-left px-3 text-muted group-hover:text-text transition-colors outline-none py-1.5 truncate ${selectedKey ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {actionLegend}
                        </button>
                        <div className={`flex items-center gap-1 px-1 shrink-0 absolute right-1 ${!selectedKey ? 'hidden' : ''}`}>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedKey && actionLegend !== '—') removeKeyAction(selectedKey.code);
                                }}
                                disabled={actionLegend === '—'}
                                className={`text-muted transition-colors w-6 h-6 flex items-center justify-center rounded-[var(--radius-input)] outline-none text-xs ${actionLegend !== '—' ? 'hover:text-accent hover:bg-white/5 cursor-pointer' : 'opacity-20 cursor-default'}`}
                                title="Remove"
                            >
                                🗙
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isPickerOpen && (
                <KeyPicker 
                    onClose={() => setIsPickerOpen(false)}
                    onSelect={(code) => {
                        setKeyAction(code);
                        setIsPickerOpen(false);
                    }}
                />
            )}
        </div>
    );
}
