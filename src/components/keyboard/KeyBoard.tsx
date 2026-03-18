import { useRef, useMemo } from 'react';
import { useKeymapService, normalizeLayout, flattenAndPosition } from '../../features/keymap';
import Key from './Key';
import { CustomScrollbar } from '../ui/CustomScrollbar';
import type { KeyGeom } from '../../features/keymap';

type BlocksLayout = { type: 'blocks'; blocks: { id: string; data: KeyGeom[] }[] };
type SingleLayout = { type: 'single'; data: KeyGeom[] };
type LayoutVariant = BlocksLayout | SingleLayout;

// Import raw geometries
import { 
    ISO_mainBlockGeom as rawGenericMain, 
    ISO_navBlockGeom as rawGenericNav, 
    ISO_numpadBlockGeom as rawGenericNumpad 
} from './geometry/generic-iso-105/isoLayout';

import { 
    ISO_laptop_fKeyRow as rawMac 
} from './geometry/mac-air-iso-f-key-physical/isoLayout';

export default function KeyBoard() {
    const { geometry } = useKeymapService();
    const scrollRef = useRef<HTMLDivElement>(null);

    const layoutMap: Record<string, LayoutVariant> = useMemo(() => {
        return {
            'generic-iso-105': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(rawGenericMain)) },
                    { id: 'nav', data: flattenAndPosition(normalizeLayout(rawGenericNav)) },
                    { id: 'numpad', data: flattenAndPosition(normalizeLayout(rawGenericNumpad)) }
                ]
            },
            'mac-air-iso-f-key-physical': {
                type: 'single',
                data: flattenAndPosition(normalizeLayout(rawMac))
            }
        };
    }, []);

    const currentLayout: LayoutVariant = layoutMap[geometry] ?? layoutMap['generic-iso-105'];

    const renderKeyItem = (key: KeyGeom) => {
        if (key.type === 'cluster' && key.rows) {
            return (
                <div key={key.code} className="flex flex-col gap-[var(--gap)]">
                    {key.rows!.map((row: KeyGeom[], idx: number) => (
                        <div key={`${key.code}-row-${idx}`} className="flex flex-row gap-[var(--gap)]">
                            {row.map(renderKeyItem)}
                        </div>
                    ))}
                </div>
            );
        }
        return <Key key={key.code} keyInfo={key} />;
    };

    const renderLayout = () => {
        if (currentLayout.type === 'blocks') {
            return (
                <div className="flex flex-row gap-[var(--cluster-gap)] items-start">
                    {currentLayout.blocks.map((block: { id: string; data: KeyGeom[] }) => {
                        const maxW = Math.max(...block.data.map((k: KeyGeom) => (k.x ?? 0) + (k.w ?? 0) - 1));
                        const maxH = Math.max(...block.data.map((k: KeyGeom) => (k.y ?? 0) + (k.h ?? 0) - 1));
                        
                        return (
                            <div 
                                key={block.id} 
                                className="grid gap-[var(--gap)] h-fit"
                                style={{
                                    gridTemplateColumns: `repeat(${maxW}, var(--u))`,
                                    gridTemplateRows: `repeat(${maxH}, var(--key-h))`,
                                }}
                            >
                                {block.data.map(renderKeyItem)}
                            </div>
                        );
                    })}
                </div>
            );
        }

        const maxW = Math.max(...currentLayout.data.map((k: KeyGeom) => (k.x ?? 0) + (k.w ?? 0) - 1));
        const maxH = Math.max(...currentLayout.data.map((k: KeyGeom) => (k.y ?? 0) + (k.h ?? 0) - 1));

        return (
            <div 
                className="grid gap-[var(--gap)] h-fit"
                style={{
                    gridTemplateColumns: `repeat(${maxW}, var(--u))`,
                    gridTemplateRows: `repeat(${maxH}, var(--key-h))`,
                }}
            >
                {currentLayout.data.map(renderKeyItem)}
            </div>
        );
    };

    return (
        <div className="kbd-panel w-full max-w-full flex flex-col gap-4">
            <div 
                ref={scrollRef}
                className="keyboard-section overflow-x-auto pt-[var(--gap)] px-[var(--gap)] pb-2"
            >
                <div className="keyboard-wrapper">
                    {renderLayout()}
                </div>
            </div>
            <CustomScrollbar scrollRef={scrollRef} className="mt-2" />
        </div>
    );
}
