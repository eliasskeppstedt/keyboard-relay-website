import React from 'react';
import type { KeyGeom } from '../../features/keymap';
import { useKeymapService } from '../../features/keymap';
import { resolveKeyLegend } from '../../utils/key-resolution';

interface KeyProps {
    keyInfo: KeyGeom;
}

export default function Key({ keyInfo }: KeyProps) {
    const { selectedKey, setSelectedKey, geometry, os, language, remapStore } = useKeymapService();

    if (keyInfo.type === 'spacer') {
        return (
            <div
                className="key-spacer"
                style={{ 
                    "--w": keyInfo.w,
                    gridColumn: `${keyInfo.x} / span ${keyInfo.w}`,
                    gridRow: `${keyInfo.y} / span ${keyInfo.h}`,
                } as React.CSSProperties}
            />
        );
    }

    const { w, h, code, x, y } = keyInfo;
    
    if (code === 'keyInvisible') {
        return (
            <div
                className="key-invisible"
                style={{ 
                    gridColumn: `${x} / span ${w}`,
                    gridRow: `${y} / span ${h}`,
                } as React.CSSProperties}
            />
        );
    }
    const isSelected = selectedKey?.code === code;
    
    // Check if key has a press action assigned
    const hasPressAction = remapStore?.remaps?.layers?.[0]?.keys?.some(
        (k) => k.code === code && k.actions?.some((a) => a.press)
    );

    // Resolve dynamic legend
    const legend = resolveKeyLegend(code, geometry, os, language, remapStore);
    const isSpace = w > 4 && code === 'Space';

    return (
        <button
            onClick={() => setSelectedKey(keyInfo)}
            className={`
                key transition-all duration-150
                ${isSpace ? 'opacity-90' : ''}
                ${isSelected ? 'selected ring-2 ring-accent' : ''}
                ${hasPressAction ? 'bg-success/15 border-success/50 text-success' : 'bg-card border-border text-text hover:bg-white/5'}
                relative border rounded-[var(--round)] cursor-pointer flex-shrink-0
            `}
            style={{
                "--w": w,
                "--h": h,
                gridColumn: `${x} / span ${w}`,
                gridRow: `${y} / span ${h}`,
                width: `calc((var(--u) * var(--w)) + (var(--gap) * (var(--w) - 1)))`,
                height: `calc((var(--key-h) * var(--h)) + (var(--gap) * (var(--h) - 1)))`,
            } as React.CSSProperties}
        >
            <div className={`flex items-center justify-center h-full text-[13px] font-mono uppercase ${hasPressAction ? 'font-bold' : ''}`}>
                {legend}
            </div>
        </button>
    );
}
