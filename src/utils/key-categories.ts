import { VK_ANSI } from '../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../components/keyboard/codes/virtual-keys/jis';
import { LANGUAGES } from '../components/keyboard/codes/languages';
import type { GeometrySelection, LanguageSelection, OSSelection } from '../features/keymap/keymap.types';
import type { VKC } from '../components/keyboard/codes/virtual-keys/constants';

export interface CategoryItem {
    code: string;
    label: string;
    description: string;
    lang?: string;
}

export interface PickerCategory {
    name: string;
    items: CategoryItem[];
}

export function getKeyPickerCategories(
    geometry: GeometrySelection,
    os: OSSelection,
    language: LanguageSelection
): PickerCategory[] {
    // Determine base table
    let vkcTable = VK_ANSI;
    if (geometry.includes('iso')) vkcTable = VK_ISO;
    else if (geometry.includes('jis')) vkcTable = VK_JIS;

    const langOverrides = LANGUAGES[language] || {};

    const resolveItem = (code: string, vkc: VKC): CategoryItem => {
        let label = vkc.legend || code.replace('Key', '').replace('Digit', '');
        let description = vkc.description || "";

        // Apply OS Overrides
        if (os === 'WINDOWS') {
            const winOverrides: Record<string, { label?: string, desc?: string }> = {
                'MetaLeft': { label: 'L ⊞', desc: 'L win;left windows;left super' },
                'MetaRight': { label: 'R ⊞', desc: 'R win;right windows;rigth super' },
                'AltLeft': { label: 'Alt' },
                'AltRight': { label: 'AltGr' },
                'ControlLeft': { label: 'L ✲' },
                'ControlRight': { label: 'R ✲' }
            };
            if (winOverrides[code]) {
                if (winOverrides[code].label) label = winOverrides[code].label!;
                if (winOverrides[code].desc) description = winOverrides[code].desc!;
            }
        } else if (os === 'LINUX') {
            const linuxOverrides: Record<string, { label?: string, desc?: string }> = {
                'MetaLeft': { label: 'L ◆', desc: 'left super' },
                'MetaRight': { label: 'R ◆', desc: 'right super' },
                'AltLeft': { label: 'Alt' },
                'AltRight': { label: 'AltGr' },
                'ControlLeft': { label: 'L ^' },
                'ControlRight': { label: 'R ^' }
            };
            if (linuxOverrides[code]) {
                if (linuxOverrides[code].label) label = linuxOverrides[code].label!;
                if (linuxOverrides[code].desc) description = linuxOverrides[code].desc!;
            }
        }

        const override = langOverrides[code];
        return {
            code,
            label: override?.legend || label,
            description: override?.description || description,
        };
    };

    const categories: PickerCategory[] = [
        {
            name: "Alphanumeric",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^(Key[A-Z]|Digit[0-9])$/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        },
        {
            name: "Modifiers",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^(Shift|Control|Alt|Meta)(Left|Right)$|^CapsLock$|^Fn$/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        },
        {
            name: "Navigation",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^(Arrow|Home|End|Page|Insert|Delete|PrintScreen|ScrollLock|Pause)/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        },
        {
            name: "Functions",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^F[0-9]+$/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        },
        {
            name: "Numpad",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^Numpad|NumLock/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        },
        {
            name: "Media & Browser",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^(Audio|Media|Browser|Launch|Sleep)/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        },
        {
            name: "Special Keys",
            items: Object.entries(vkcTable)
                .filter(([code]) => /^(Escape|Enter|Tab|Space|Backspace|Bracket|Semicolon|Quote|Backslash|Comma|Period|Slash|Minus|Equal|Backquote|IntlBackslash)$/.test(code))
                .map(([code, vkc]) => resolveItem(code, vkc))
        }
    ];

    return categories.filter(cat => cat.items.length > 0);
}
