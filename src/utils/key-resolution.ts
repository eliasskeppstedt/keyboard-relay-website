import { VK_ANSI } from '../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../components/keyboard/codes/virtual-keys/jis';
import { LANGUAGES } from '../components/keyboard/codes/languages';
import type { GeometrySelection, OSSelection, LanguageSelection, RemapStore } from '../features/keymap/keymap.types';

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
             
             // Reverse lookup the legend from the hex code
             const match = Object.values(vkcTable).find(v => (os === 'WINDOWS' ? v.windows : v.mac) === vkCodeHex);
             if (match?.legend) return match.legend;
        }
    }

    // 2. OS-Specific Overrides (Highest priority after current mapping)
    if (os === 'WINDOWS') {
        const winOverrides: Record<string, string> = {
            'MetaLeft': 'L ⊞',
            'MetaRight': 'R ⊞',
            'AltLeft': 'Alt',
            'AltRight': 'AltGr',
            'ControlLeft': 'L ✲',
            'ControlRight': 'R ✲'
        };
        if (winOverrides[code]) return winOverrides[code];
    } else if (os === 'LINUX') {
        const linuxOverrides: Record<string, string> = {
            'MetaLeft': 'L ◆',
            'MetaRight': 'R ◆',
            'AltLeft': 'Alt',
            'AltRight': 'AltGr',
            'ControlLeft': 'L ^',
            'ControlRight': 'R ^'
        };
        if (linuxOverrides[code]) return linuxOverrides[code];
    }
    
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
    // OS Overrides for descriptions
    if (os === 'WINDOWS') {
        const winDescOverrides: Record<string, string> = {
            'MetaLeft': 'L win;left windows;left super',
            'MetaRight': 'R win;right windows;rigth super',
        };
        if (winDescOverrides[code]) return winDescOverrides[code];
    } else if (os === 'LINUX') {
        const linuxDescOverrides: Record<string, string> = {
            'MetaLeft': 'left super',
            'MetaRight': 'right super',
        };
        if (linuxDescOverrides[code]) return linuxDescOverrides[code];
    }

    let vkcTable = VK_ANSI;
    if (geometry.includes('iso')) vkcTable = VK_ISO;
    const vkc = vkcTable[code];

    const langOverrides = LANGUAGES[language];
    const override = langOverrides?.[code];

    if (override?.description) return override.description;
    return vkc?.description || "";
}
