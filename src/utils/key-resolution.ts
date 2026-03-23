import { VK_ANSI } from '../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../components/keyboard/codes/virtual-keys/jis';
import { VK_EXTRAS } from '../components/keyboard/codes/extras';
import { LANGUAGES } from '../components/keyboard/codes/languages';
import type { GeometrySelection, OSSelection, LanguageSelection, RemapStore } from '../features/keymap/keymap.types';
import { getOSOverride } from './os-overrides';

export function resolveKeyLegend(
    code: string,
    geometry: GeometrySelection,
    os: OSSelection,
    language: LanguageSelection,
    remapStore: RemapStore | null,
    includeRemappings: boolean = true
) {
    // 1. Check for Active Remappings in the JSON
    if (includeRemappings && remapStore) {
        const layer = remapStore.remaps?.layers?.[0];
        const keyEntry = layer?.keys?.find((k) => k.code === code);
        const vkCodeHex = keyEntry?.actions?.[0]?.press?.vkCode;

        if (vkCodeHex !== undefined) {
             let vkcTable = VK_ANSI;
             if (geometry.includes('iso')) vkcTable = VK_ISO;
             else if (geometry.includes('jis')) vkcTable = VK_JIS;
             
             const allKeys = { ...vkcTable, ...VK_EXTRAS };
             
             // Reverse lookup the entry to get the matchCode for override checking
             const matchEntry = Object.entries(allKeys).find(([, v]) => (os === 'WINDOWS' ? (v.windows ?? v.code) : (v.mac ?? v.code)) === vkCodeHex);
             
             if (matchEntry) {
                 const [matchCode, matchVkc] = matchEntry;
                 
                 // Apply OS Overrides to the target key
                 const osOverride = getOSOverride(os, matchCode);
                 if (osOverride?.legend) return osOverride.legend;
                 
                 // Apply Language Overrides to the target key
                 const langOverrides = LANGUAGES[language];
                 if (langOverrides?.[matchCode]?.legend) return langOverrides[matchCode].legend;

                 return matchVkc.legend;
             }
        }
    }

    const osOverride = getOSOverride(os, code);
    if (osOverride?.legend) return osOverride.legend;
    
    // 3. Get the base VKC table based on geometry
    let vkcTable = VK_ANSI;
    if (geometry.includes('iso')) vkcTable = VK_ISO;
    else if (geometry.includes('jis')) vkcTable = VK_JIS;

    const vkc = vkcTable[code];
    
    // 4. Check for Language Overrides
    const langOverrides = LANGUAGES[language];
    const override = langOverrides?.[code];

    if (override?.legend) {
        return override.legend;
    }

    // 5. Fallback to VKC Base Legend
    if (vkc?.legend) {
        return vkc.legend;
    }

    // 6. Final Fallback to Code
    return code.replace('Key', '').replace('Digit', '');
}

export function resolveKeyDescription(
    code: string,
    geometry: GeometrySelection,
    os: OSSelection,
    language: LanguageSelection
) {
    const osOverride = getOSOverride(os, code);
    if (osOverride?.description) return osOverride.description;

    let vkcTable = VK_ANSI;
    if (geometry.includes('iso')) vkcTable = VK_ISO;
    else if (geometry.includes('jis')) vkcTable = VK_JIS;
    const vkc = vkcTable[code];

    const langOverrides = LANGUAGES[language];
    const override = langOverrides?.[code];

    if (override?.description) return override.description;
    return vkc?.description || "";
}
