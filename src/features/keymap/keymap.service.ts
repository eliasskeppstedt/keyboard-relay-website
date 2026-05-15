import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KeyGeom, GeometrySelection, LanguageSelection, OSSelection, RemapStore, GlobalConfig, Layer, KeyEntry, KeyAction } from './keymap.types';
import { migrateRemapStore } from './keymap.utils';
import { KEYBOARD_REGISTRY, DEFAULT_SETTINGS, type StandardFilter } from './keyboards.config';
import { VK_ANSI } from '../../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../../components/keyboard/codes/virtual-keys/jis';
import { type VKC } from '../../components/keyboard/codes/code.help';
import { VK_EXTRAS } from '../../components/keyboard/codes/extras';
import { UK_EMOJIS } from '../../components/keyboard/codes/unicodes/emojis';
import { resolveKeyLegend } from '../../utils/key-resolution';
import { type UKC } from '../../components/keyboard/codes/code.help';
import { codePointsToUtf16 } from '../../utils/unicode';

import { notify } from '../notifications/notification.service';

interface KeymapState {
    geometry: GeometrySelection;
    language: LanguageSelection;
    os: OSSelection;
    standard: StandardFilter;
    layoutName: string;
    selectedKey: KeyGeom | null;
    remapStore: RemapStore;
    setGeometry: (geometry: GeometrySelection) => void;
    setLanguage: (lang: LanguageSelection) => void;
    setOS: (os: OSSelection) => void;
    setStandard: (standard: StandardFilter) => void;
    setLayoutName: (name: string) => void;
    setSelectedKey: (key: KeyGeom | null) => void;
    setRemapStore: (data: RemapStore) => void;
    syncConfig: () => void;
    setKeyAction: (actionCode: string, type: 'press' | 'hold') => void;
    removeKeyAction: (code: string, type?: 'press' | 'hold') => void;
    getLayoutName: () => string;
}

const DEFAULT_REMAP_STRUCTURE: RemapStore = {
    remaps: {
        layers: [
            { name: 'Main', id: 0, config: {}, keys: [] }
        ],
        config: {},
        extras: []
    }
};

export const useKeymapService = create<KeymapState>()(
    persist(
        (set, get) => ({
            geometry: DEFAULT_SETTINGS.geometry,
            language: DEFAULT_SETTINGS.language,
            os: DEFAULT_SETTINGS.os,
            standard: DEFAULT_SETTINGS.standard,
            layoutName: DEFAULT_SETTINGS.layoutName,
            selectedKey: null,
            remapStore: DEFAULT_REMAP_STRUCTURE,
            
            syncConfig: () => {
                const { os, language, standard, geometry, remapStore, layoutName } = get();
                const kb = KEYBOARD_REGISTRY.find(k => k.id === geometry);
                
                const newStore = JSON.parse(JSON.stringify(remapStore));
                if (!newStore.remaps) newStore.remaps = { layers: [], config: {}, extras: [] };
                
                newStore.remaps.config = {
                    ...newStore.remaps.config,
                    os,
                    language,
                    standard,
                    keyboardName: kb?.name || geometry,
                    layout: layoutName
                };
                set({ remapStore: newStore });
            },

            setGeometry: (geometry) => {
                set({ geometry });
                get().syncConfig();
            },
            setLanguage: (language) => {
                set({ language });
                get().syncConfig();
            },
            setOS: (newOs) => {
                const { os: oldOs, remapStore, geometry } = get();
                const migratedStore = migrateRemapStore(remapStore, oldOs, newOs, geometry);
                
                const kb = KEYBOARD_REGISTRY.find(k => k.id === geometry);
                if (migratedStore.remaps) {
                    migratedStore.remaps.config = {
                        ...migratedStore.remaps.config,
                        os: newOs,
                        keyboardName: kb?.name || geometry
                    };
                }
                
                set({ os: newOs, remapStore: migratedStore });
            },
            setStandard: (standard) => {
                set({ standard });
                get().syncConfig();
            },
            setLayoutName: (layoutName) => {
                set({ layoutName });
                get().syncConfig();
            },
            setRemapStore: (newStore) => {
                const config = newStore.remaps?.config as (GlobalConfig | undefined);
                const updates: Partial<KeymapState> = { remapStore: newStore };
                
                if (config) {
                    if (config.os) updates.os = config.os as OSSelection;
                    if (config.language) updates.language = config.language as LanguageSelection;
                    if (config.standard) updates.standard = config.standard as StandardFilter;
                    if (config.keyboardName) {
                        const kb = KEYBOARD_REGISTRY.find(k => k.name === config.keyboardName || k.id === config.keyboardName);
                        if (kb) updates.geometry = kb.id;
                    }
                    if (config.layout) updates.layoutName = config.layout;
                }
                
                set(updates);
            },
            setSelectedKey: (key) => set({ selectedKey: key }),
            setKeyAction: (actionCode, actionType) => {
                const { selectedKey, geometry, remapStore, os, language } = get();
                if (!selectedKey) return;

                // Lookup vkc tables
                let vkcTable = VK_ANSI;
                if (geometry.includes('iso')) vkcTable = VK_ISO;
                else if (geometry.includes('jis')) vkcTable = VK_JIS;

                const targetVkc = vkcTable[actionCode] || VK_EXTRAS[actionCode] || UK_EMOJIS[actionCode];
                const baseVkc = vkcTable[selectedKey.code];

                if (!targetVkc || !baseVkc) return;

                const targetHex = 'codePoints' in targetVkc
                    ? (targetVkc as UKC).codePoints
                    : (os === 'WINDOWS' ? ((targetVkc as VKC).windows ?? (targetVkc as VKC).code) : ((targetVkc as VKC).mac ?? (targetVkc as VKC).code));

                const baseHex = os === 'WINDOWS' ? ((baseVkc as VKC).windows ?? (baseVkc as VKC).code) : ((baseVkc as VKC).mac ?? (baseVkc as VKC).code);

                // Update JSON structure
                const newJson = JSON.parse(JSON.stringify(remapStore));
                if (!newJson.remaps) newJson.remaps = { layers: [], config: {}, extras: [] };
                if (!newJson.remaps.layers || newJson.remaps.layers.length === 0) {
                    newJson.remaps.layers = [{ name: 'Main', id: 0, config: {}, keys: [] }];
                }

                const mainLayer = newJson.remaps.layers[0];
                if (!mainLayer.keys) mainLayer.keys = [];

                const isUnicode = 'codePoints' in targetVkc;
                const rawCodes = Array.isArray(targetHex) ? targetHex : [targetHex];
                const finalCodes = isUnicode ? codePointsToUtf16(rawCodes as number[]) : rawCodes as number[];

                const newAction: KeyAction = {
                    type: actionType,
                    outputType: (isUnicode ? 'unicode' : 'vkCode') as 'vkCode' | 'unicode',
                    codes: [finalCodes]
                };

                // Find existing entry or create new
                let keyEntry = mainLayer.keys.find((k: { code: string }) => k.code === selectedKey.code);
                if (!keyEntry) {
                    keyEntry = {
                        code: selectedKey.code,
                        vkCode: baseHex,
                        actions: []
                    };
                    mainLayer.keys.push(keyEntry);
                }

                // Remove existing action of the same type if any
                keyEntry.actions = keyEntry.actions.filter((a: KeyAction) => a.type !== actionType);
                keyEntry.actions.push(newAction);

                set({ remapStore: newJson });
                get().syncConfig();
                const baseLegend = resolveKeyLegend(selectedKey.code, geometry, os, language, newJson, false);
                notify.success(`Mapped ${baseLegend} (${actionType}) to ${targetVkc.legend}`);
            },
            removeKeyAction: (code, actionType) => {
                const { remapStore } = get();
                if (!remapStore?.remaps?.layers?.[0]) return;

                const newJson = JSON.parse(JSON.stringify(remapStore));
                const mainLayer = newJson.remaps.layers[0];
                if (mainLayer.keys) {
                    if (actionType) {
                        const keyEntry = mainLayer.keys.find((k: { code: string }) => k.code === code);
                        if (keyEntry) {
                            keyEntry.actions = keyEntry.actions.filter((a: KeyAction) => a.type !== actionType);
                            // Remove key entry if no actions left
                            if (keyEntry.actions.length === 0) {
                                mainLayer.keys = mainLayer.keys.filter((k: { code: string }) => k.code !== code);
                            }
                        }
                    } else {
                        mainLayer.keys = mainLayer.keys.filter((k: { code: string }) => k.code !== code);
                    }
                }

                const { geometry, os, language } = get();
                const baseLegend = resolveKeyLegend(code, geometry, os, language, newJson, false);
                set({ remapStore: newJson });
                get().syncConfig();
                notify.info(`Removed mapping ${actionType ? `(${actionType}) ` : ''}for ${baseLegend}`);
            },
            getLayoutName: () => {
                const { layoutName } = get();
                if (!layoutName || !layoutName.trim()) return 'my-remap';
                const slug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return slug(layoutName);
            }
        }),
        {
            name: 'keymap-storage',
            partialize: (state) => ({
                geometry: state.geometry,
                language: state.language,
                os: state.os,
                standard: state.standard,
                layoutName: state.layoutName,
                remapStore: state.remapStore
            }),
            onRehydrateStorage: () => (state) => {
                if (state && state.remapStore) {
                    if (!state.remapStore.remaps) {
                        state.remapStore.remaps = { layers: [], config: {}, extras: [] };
                    }
                    if (!state.remapStore.remaps.extras) {
                        state.remapStore.remaps.extras = [];
                    }

                    // Migration: old formats -> new flat KeyAction with codes: number[][]
                    state.remapStore.remaps.layers?.forEach((layer: Layer) => {
                        layer.keys?.forEach((key: KeyEntry) => {
                            key.actions = key.actions?.map((action: KeyAction | Record<string, unknown>) => {
                                // Already new format
                                if ('outputType' in action && Array.isArray(action.codes)) {
                                    return action as KeyAction;
                                }
                                // Old format: { press: { type, codes } } or { press: { type, code } }
                                const press = (action as Record<string, unknown>).press as Record<string, unknown> | undefined;
                                if (press) {
                                    const oldCodes = press.codes as number[] | undefined;
                                    const oldCode = press.code as number | number[] | undefined;
                                    let codes: number[][];
                                    if (oldCodes) {
                                        codes = [oldCodes];
                                    } else if (oldCode !== undefined) {
                                        codes = Array.isArray(oldCode) ? [oldCode] : [[oldCode]];
                                    } else {
                                        codes = [];
                                    }
                                    const outputType = (press.type as string) || 'vkCode';
                                    let finalCodes = codes;
                                    
                                    // If it was already unicode but used code points, convert to UTF-16
                                    if (outputType === 'unicode' && codes.length > 0) {
                                        const sample = codes[0];
                                        // Simple heuristic: if any value is > 0xFFFF, it's a code point
                                        const isCodePoint = sample.some(c => c > 0xFFFF);
                                        // OR if it's a known emoji code point (range 0x1F000+)
                                        const hasEmojiCodePoint = sample.some(c => c >= 0x1F000);
                                        
                                        if (isCodePoint || hasEmojiCodePoint) {
                                            finalCodes = [codePointsToUtf16(sample)];
                                        }
                                    }

                                    return {
                                        type: 'press' as const,
                                        outputType,
                                        codes: finalCodes
                                    } as KeyAction;
                                }
                                return action as KeyAction;
                            }) || [];
                        });
                    });
                }
            }
        }
    )
);
