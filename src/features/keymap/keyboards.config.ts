import type { KeyboardDefinition, OSSelection, LanguageSelection } from './keymap.types';

export type StandardFilter = 'Show All' | KeyboardDefinition['standard'];

export const KEYBOARD_REGISTRY: KeyboardDefinition[] = [
    // ISO
    { id: 'iso-100-generic', name: 'ISO 100 - Generic', standard: 'ISO' },
    { id: 'iso-80-generic', name: 'ISO 80 - Generic', standard: 'ISO' },
    { id: 'iso-75-generic', name: 'ISO 75 - Generic', standard: 'ISO' },
    { id: 'iso-65-generic', name: 'ISO 65 - Generic', standard: 'ISO' },
    { id: 'iso-60-generic', name: 'ISO 60 - Generic', standard: 'ISO' },

    // ANSI
    { id: 'ansi-100-generic', name: 'ANSI 100 - Generic', standard: 'ANSI' },

    // JIS
    { id: 'jis-100-generic', name: 'JIS 100 - Generic', standard: 'JIS' },
    { id: 'jis-60-generic', name: 'JIS 60 - Generic', standard: 'JIS' },

    // APPLE
    { id: 'mac-air-iso-f-key-physical', name: 'ISO - MacBook - Physical F-Keys', standard: 'APPLE' }
];

// ─── Default startup settings ────────────────────────────────────────────────
// Change these values to adjust what the app starts with on a fresh session.
export const DEFAULT_SETTINGS = {
    language: 'swedish' as LanguageSelection,
    os: 'WINDOWS' as OSSelection,
    standard: 'Show All' as StandardFilter,
    geometry: 'iso-100-generic',
    layoutName: 'My Remap',
} as const;
// ────────────────────────────────────────────────────────────────────────────

export const getAvailableOS = (): OSSelection[] => {
    return ['WINDOWS', 'MAC'];
};

export const getAvailableStandards = (): StandardFilter[] => {
    return ['Show All', 'ISO', 'ANSI', 'JIS', 'APPLE'];
};

export const getKeyboardsByStandard = (standard: StandardFilter): KeyboardDefinition[] => {
    if (standard === 'Show All') return KEYBOARD_REGISTRY;
    return KEYBOARD_REGISTRY.filter(kb => kb.standard === standard);
};

// Internal logic for HEX codes (distinguish Mac specific layouts)
export const getLayoutOS = (): 'WINDOWS' | 'MAC' => {
    return 'WINDOWS';
};
