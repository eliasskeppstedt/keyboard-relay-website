import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KeyGeom, GeometrySelection, LanguageSelection, OSSelection, RemapStore } from './keymap.types';
import { migrateRemapStore } from './keymap.utils';
import { DEFAULT_SETTINGS, type StandardFilter } from './keyboards.config';
import { VK_ANSI } from '../../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../../components/keyboard/codes/virtual-keys/jis';
import { VK_EXTRAS } from '../../components/keyboard/codes/extras';
import { resolveKeyLegend } from '../../utils/key-resolution';

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
            geometry:   DEFAULT_SETTINGS.geometry,
            language:   DEFAULT_SETTINGS.language,
            os:         DEFAULT_SETTINGS.os,
            standard:   DEFAULT_SETTINGS.standard,
            layoutName: DEFAULT_SETTINGS.layoutName,
            selectedKey: null,
            remapStore: DEFAULT_REMAP_STRUCTURE,
            setGeometry: (geometry) => set({ geometry }),
            setLanguage: (language) => set({ language }),
            setOS: (newOs) => {
                const { os: oldOs, remapStore, geometry } = get();
                const migratedStore = migrateRemapStore(remapStore, oldOs, newOs, geometry);
                set({ os: newOs, remapStore: migratedStore });
            },
            setStandard: (standard) => set({ standard }),
            setLayoutName: (layoutName) => set({ layoutName }),
            setSelectedKey: (key) => set({ selectedKey: key }),
            setKeyAction: (actionCode) => {
                const { selectedKey, geometry, remapStore, os } = get();
                if (!selectedKey) return;

                // Lookup vkc tables
                let vkcTable = VK_ANSI;
                if (geometry.includes('iso')) vkcTable = VK_ISO;
                else if (geometry.includes('jis')) vkcTable = VK_JIS;
                
                const targetVkc = vkcTable[actionCode] || VK_EXTRAS[actionCode];
                const baseVkc = vkcTable[selectedKey.code];
                
                if (!targetVkc || !baseVkc) return;

                const targetHex = os === 'WINDOWS' ? (targetVkc.windows ?? targetVkc.code) : (targetVkc.mac ?? targetVkc.code);
                const baseHex = os === 'WINDOWS' ? (baseVkc.windows ?? baseVkc.code) : (baseVkc.mac ?? baseVkc.code);

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
                                type: targetVkc.keyType,
                                vkCode: targetHex
                            }
                        }
                    ]
                };

                // Remove existing entry for this code if any
                mainLayer.keys = mainLayer.keys.filter((k: { code: string }) => k.code !== selectedKey.code);
                mainLayer.keys.push(keyEntry);

                const { language } = get();
                if (!newJson.remaps.config) {
                    newJson.remaps.config = { os, language, layout: '' };
                } else {
                    newJson.remaps.config.os = os;
                    newJson.remaps.config.language = language;
                }

                set({ remapStore: newJson });
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
                }
            }
        }
    )
);
