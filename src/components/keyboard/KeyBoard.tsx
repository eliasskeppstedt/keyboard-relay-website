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
    ISO_mainBlockGeom as raw100Main,
    ISO_navBlockGeom as raw100Nav,
    ISO_numpadBlockGeom as raw100Numpad
} from './geometry/iso-100-generic';

import {
    ANSI_mainBlockGeom as rawANSI100Main,
    ANSI_navBlockGeom as rawANSI100Nav,
    ANSI_numpadBlockGeom as rawANSI100Numpad
} from './geometry/ansi-100-generic';

import {
    JIS_mainBlockGeom as rawJIS100Main,
    JIS_navBlockGeom as rawJIS100Nav,
    JIS_numpadBlockGeom as rawJIS100Numpad
} from './geometry/jis-100-generic';

import {
    ISO_mainBlockGeom as raw80Main,
    ISO_navBlockGeom as raw80Nav
} from './geometry/iso-80-generic';

import {
    ISO_75_mainBlockGeom as raw75Main,
    //ISO_75_navBlockGeom as raw75Nav
} from './geometry/iso-75-generic';

import {
    ISO_65_mainBlockGeom as raw65Main,
    //ISO_65_navBlockGeom as raw65Nav
} from './geometry/iso-65-generic';

import {
    ISO_60_mainBlockGeom as raw60Main
} from './geometry/iso-60-generic';

import {
    JIS_60_mainBlockGeom as raw60JISMain
} from './geometry/jis-60-generic';

import {
    ISO_laptop_fKeyRow as rawMac
} from './geometry/mac-macbook-iso-physical-f-keys';

export default function KeyBoard() {
    const { geometry } = useKeymapService();
    const scrollRef = useRef<HTMLDivElement>(null);

    const layoutMap: Record<string, LayoutVariant> = useMemo(() => {
        return {
            'iso-100-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(raw100Main)) },
                    { id: 'nav', data: flattenAndPosition(normalizeLayout(raw100Nav)) },
                    { id: 'numpad', data: flattenAndPosition(normalizeLayout(raw100Numpad)) }
                ]
            },
            'ansi-100-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(rawANSI100Main)) },
                    { id: 'nav', data: flattenAndPosition(normalizeLayout(rawANSI100Nav)) },
                    { id: 'numpad', data: flattenAndPosition(normalizeLayout(rawANSI100Numpad)) }
                ]
            },
            'jis-100-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(rawJIS100Main)) },
                    { id: 'nav', data: flattenAndPosition(normalizeLayout(rawJIS100Nav)) },
                    { id: 'numpad', data: flattenAndPosition(normalizeLayout(rawJIS100Numpad)) }
                ]
            },
            'iso-80-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(raw80Main)) },
                    { id: 'nav', data: flattenAndPosition(normalizeLayout(raw80Nav)) }
                ]
            },
            'iso-75-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(raw75Main)) },
                    //{ id: 'nav', data: flattenAndPosition(normalizeLayout(raw75Nav)) }
                ]
            },
            'iso-65-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(raw65Main)) },
                    //{ id: 'nav', data: flattenAndPosition(normalizeLayout(raw65Nav)) }
                ]
            },
            'iso-60-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(raw60Main)) }
                ]
            },
            'jis-60-generic': {
                type: 'blocks',
                blocks: [
                    { id: 'main', data: flattenAndPosition(normalizeLayout(raw60JISMain)) }
                ]
            },
            'mac-air-iso-f-key-physical': {
                type: 'single',
                data: flattenAndPosition(normalizeLayout(rawMac))
            }
        };
    }, []);

    const currentLayout: LayoutVariant = layoutMap[geometry] ?? layoutMap['iso-100-generic'];

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
