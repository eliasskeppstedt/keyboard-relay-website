import type { KeyboardDefinition, OSSelection, LanguageSelection } from './keymap.types';

export type StandardFilter = 'Show All' | KeyboardDefinition['standard'];

export const KEYBOARD_REGISTRY: KeyboardDefinition[] = [
    {
        id: 'generic-iso-105',
        name: 'ISO 105 - Generic',
        standard: 'ISO',
    },
    {
        id: 'mac-air-iso-f-key-physical',
        name: 'ISO - MacBook - Physical F-Keys',
        standard: 'ISO',
    }
];

// ─── Default startup settings ────────────────────────────────────────────────
// Change these values to adjust what the app starts with on a fresh session.
export const DEFAULT_SETTINGS = {
    language:   'swedish'           as LanguageSelection,
    os:         'WINDOWS'           as OSSelection,
    standard:   'Show All'          as StandardFilter,
    geometry:   'generic-iso-105',
    layoutName: 'My Remap',
} as const;
// ────────────────────────────────────────────────────────────────────────────

export const getAvailableOS = (): OSSelection[] => {
    return ['WINDOWS', 'MAC'];
};

export const getAvailableStandards = (): StandardFilter[] => {
    const unique = Array.from(new Set(KEYBOARD_REGISTRY.map(kb => kb.standard)));
    return ['Show All', ...unique] as StandardFilter[];
};

export const getKeyboardsByStandard = (standard: StandardFilter): KeyboardDefinition[] => {
    if (standard === 'Show All') return KEYBOARD_REGISTRY;
    return KEYBOARD_REGISTRY.filter(kb => kb.standard === standard);
};

// Internal logic for HEX codes (distinguish Mac specific layouts)
export const getLayoutOS = (): 'WINDOWS' | 'MAC' => {
    return 'WINDOWS';
};
