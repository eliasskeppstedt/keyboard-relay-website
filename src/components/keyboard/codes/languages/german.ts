import { type LanguageOverride } from './swedish';

export const GERMAN_OVERRIDE: Record<string, LanguageOverride> = {
    KeyZ: { legend: "Y" },
    KeyY: { legend: "Z" },
    Backquote: { legend: "^" },
    Minus: { legend: "ß" },
    Equal: { legend: "´" },
    BracketLeft: { legend: "Ü" },
    BracketRight: { legend: "*" },
    Semicolon: { legend: "Ö" },
    Quote: { legend: "Ä" },
    Backslash: { legend: "#" },
    Slash: { legend: "-" },
    IntlBackslash: { legend: "<" },
};
