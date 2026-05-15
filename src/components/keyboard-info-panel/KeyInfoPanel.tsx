import { useState } from 'react';
import { useKeymapService } from '../../features/keymap';
import { resolveKeyLegend } from '../../utils/key-resolution';
import { KeyPicker } from './KeyPicker';
import { notify } from '../../features/notifications/notification.service';

import { VK_ANSI } from '../keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../keyboard/codes/virtual-keys/jis';
import { VK_EXTRAS } from '../keyboard/codes/extras';
import { UK_EMOJIS } from '../keyboard/codes/unicodes/emojis';
import { utf16ToCodePoints } from '../../utils/unicode';
import { type UKC, type VKC } from '../keyboard/codes/code.help';

export default function KeyInfoPanel() {
    const { selectedKey, geometry, os, language, setKeyAction, removeKeyAction, remapStore } = useKeymapService();
    const [pickerType, setPickerType] = useState<'press' | 'hold' | null>(null);

    const legend = selectedKey ? resolveKeyLegend(selectedKey.code, geometry, os, language, remapStore, false) : '—';

    // Helper to find the current action legend from JSON
    const getActionLegend = (type: 'press' | 'hold') => {
        if (!selectedKey || !remapStore) return '—';
        const layer = remapStore.remaps?.layers?.[0];
        const keyEntry = layer?.keys?.find((k) => k.code === selectedKey.code);
        const action = keyEntry?.actions?.find(a => a.type === type);
        const rawCodes = action?.codes?.[0];
        const outputType = action?.outputType;

        if (rawCodes === undefined) return '—';

        const vkCodeHex = outputType === 'unicode' ? utf16ToCodePoints(rawCodes) : rawCodes;

        // Match hex back to legend
        let vkcTable = VK_ANSI;
        if (geometry.includes('iso')) vkcTable = VK_ISO;
        else if (geometry.includes('jis')) vkcTable = VK_JIS;

        const allKeys = { ...vkcTable, ...VK_EXTRAS, ...UK_EMOJIS };
        const match = Object.values(allKeys).find(v => {
            const target = 'codePoints' in v
                ? (v as UKC).codePoints
                : (os === 'WINDOWS' ? ((v as VKC).windows ?? (v as VKC).code) : ((v as VKC).mac ?? (v as VKC).code));

            if (Array.isArray(target)) {
                return target.length === vkCodeHex.length && target.every((val, index) => val === vkCodeHex[index]);
            }
            // Single number target vs array: match if array has one element
            if (vkCodeHex.length === 1) {
                return target === vkCodeHex[0];
            }
            return false;
        });

        if (match) return match.legend || 'Selected';

        return `U+${vkCodeHex.map(c => c.toString(16).toUpperCase()).join('_')}`;
    };

    const pressLegend = getActionLegend('press');
    const isPressUnknown = pressLegend !== '—' && (pressLegend.startsWith('0x') || pressLegend.startsWith('U+'));

    const holdLegend = getActionLegend('hold');
    const isHoldUnknown = holdLegend !== '—' && (holdLegend.startsWith('0x') || holdLegend.startsWith('U+'));

    const ActionSection = ({ type, legend, isUnknown }: { type: 'press' | 'hold', legend: string, isUnknown: boolean }) => (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
                <h3 className="text-[10px] font-mono text-muted uppercase">{type}</h3>
                <span className={`text-[10px] italic ${isUnknown ? 'text-red-500' : 'text-accent/60'}`}>
                    {selectedKey ? (legend === '—' ? 'Pick a key' : (isUnknown ? 'unknown key code' : 'Key assigned')) : 'No character selected'}
                </span>
            </div>
            <div
                onClick={() => {
                    if (!selectedKey) {
                        notify.info(`Choose a key to select a ${type} action`);
                        return;
                    }
                    setPickerType(type);
                }}
                className={`
                    bg-bg border border-border rounded-[var(--radius-input)] relative flex items-center p-1 font-mono text-lg transition-all 
                    ${selectedKey ? 'focus-within:border-accent/40 cursor-pointer hover:border-accent/30 hover:bg-white/5 group' : 'opacity-40'}
                `}
            >
                <button
                    className={`flex-1 text-left px-3 text-muted group-hover:text-text transition-colors outline-none py-1.5 truncate ${selectedKey ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    {legend}
                </button>
                <div className={`flex items-center gap-1 px-1 shrink-0 absolute right-1 ${!selectedKey ? 'hidden' : ''}`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (selectedKey && legend !== '—') removeKeyAction(selectedKey.code, type);
                        }}
                        disabled={legend === '—'}
                        className={`text-muted transition-colors w-6 h-6 flex items-center justify-center rounded-[var(--radius-input)] outline-none text-xs ${legend !== '—' ? 'hover:text-accent hover:bg-white/5 cursor-pointer' : 'opacity-20 cursor-default'}`}
                        title="Remove"
                    >
                        🗙
                    </button>
                </div>
            </div>
        </div>
    );

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

                <ActionSection type="press" legend={pressLegend} isUnknown={isPressUnknown} />
                <ActionSection type="hold" legend={holdLegend} isUnknown={isHoldUnknown} />
            </div>

            {pickerType && (
                <KeyPicker
                    onClose={() => setPickerType(null)}
                    onSelect={(code) => {
                        setKeyAction(code, pickerType);
                        setPickerType(null);
                    }}
                />
            )}
        </div>
    );
}
