import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KeyGeom, GeometrySelection, LanguageSelection, OSSelection, RemapStore, GlobalConfig, Layer, KeyEntry, PressAction } from './keymap.types';
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
    setKeyAction: (code: string) => void;
    removeKeyAction: (code: string) => void;
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
            setKeyAction: (actionCode) => {
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

                const keyEntry = {
                    code: selectedKey.code,
                    vkCode: baseHex,
                    actions: [
                        {
                            press: {
                                type: targetVkc.keyType === 'VKC' ? 'vkCode' : 'unicode',
                                codes: Array.isArray(targetHex) ? targetHex : [targetHex]
                            }
                        }
                    ]
                };

                // Remove existing entry for this code if any
                mainLayer.keys = mainLayer.keys.filter((k: { code: string }) => k.code !== selectedKey.code);
                mainLayer.keys.push(keyEntry);

                set({ remapStore: newJson });
                get().syncConfig();
                const baseLegend = resolveKeyLegend(selectedKey.code, geometry, os, language, newJson, false);
                notify.success(`Mapped ${baseLegend} to ${targetVkc.legend}`);
            },
            removeKeyAction: (code) => {
                const { remapStore } = get();
                if (!remapStore?.remaps?.layers?.[0]) return;

                const newJson = JSON.parse(JSON.stringify(remapStore));
                const mainLayer = newJson.remaps.layers[0];
                if (mainLayer.keys) {
                    mainLayer.keys = mainLayer.keys.filter((k: { code: string }) => k.code !== code);
                }

                const { geometry, os, language } = get();
                const baseLegend = resolveKeyLegend(code, geometry, os, language, newJson, false);
                set({ remapStore: newJson });
                get().syncConfig();
                notify.info(`Removed mapping for ${baseLegend}`);
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

                    // Migration: code -> codes []
                    state.remapStore.remaps.layers?.forEach((layer: Layer) => {
                        layer.keys?.forEach((key: KeyEntry) => {
                            key.actions?.forEach((action: { press: PressAction }) => {
                                if (action.press && (action.press as unknown as { code?: number | number[] }).code !== undefined && !action.press.codes) {
                                    const oldCode = (action.press as unknown as { code?: number | number[] }).code;
                                    action.press.codes = Array.isArray(oldCode) ? oldCode : (oldCode !== undefined ? [oldCode] : []);
                                    delete (action.press as unknown as { code?: number | number[] }).code;
                                }
                            });
                        });
                    });
                }
            }
        }
    )
);
