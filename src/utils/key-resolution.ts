import { VK_ANSI } from '../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../components/keyboard/codes/virtual-keys/jis';
import { VK_EXTRAS } from '../components/keyboard/codes/extras';
import { UK_EMOJIS } from '../components/keyboard/codes/unicodes/emojis';
import { LANGUAGES } from '../components/keyboard/codes/languages';
import { type UKC, type VKC } from '../components/keyboard/codes/code.help';
import type { GeometrySelection, OSSelection, LanguageSelection, RemapStore } from '../features/keymap/keymap.types';
import { utf16ToCodePoints } from './unicode';
import { getOSOverride } from './os-overrides';

export function resolveKeyLegend(
    code: string,
    geometry: GeometrySelection,
    os: OSSelection,
    language: LanguageSelection,
    remapStore: RemapStore | null,
    includeRemappings: boolean = true,
    actionType: 'press' | 'hold' = 'press'
) {
    // 1. Check for Active Remappings in the JSON
    if (includeRemappings && remapStore) {
        const layer = remapStore.remaps?.layers?.[0];
        const keyEntry = layer?.keys?.find((k) => k.code === code);
        const action = keyEntry?.actions?.find(a => a.type === actionType);
        const rawCodes = action?.codes?.[0] as number[] | undefined;
        const outputType = action?.outputType;

        if (rawCodes !== undefined) {
            const vkCodeHex = outputType === 'unicode' ? utf16ToCodePoints(rawCodes) : rawCodes;
            let vkcTable = VK_ANSI;
            if (geometry.includes('iso')) vkcTable = VK_ISO;
            else if (geometry.includes('jis')) vkcTable = VK_JIS;

            const allKeys = { ...vkcTable, ...VK_EXTRAS, ...UK_EMOJIS };

            // Reverse lookup the entry to get the matchCode for override checking
            const matchEntry = Object.entries(allKeys).find(([, v]) => {
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

            // If remapped but unknown, return hex
            return `U+${vkCodeHex.map(c => c.toString(16).toUpperCase()).join('_')}`;
        }
    }

    if (actionType === 'hold') return "";

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
