export interface LanguageOverride {
    legend?: string;
    description?: string;
    showDescription?: boolean;
}

export const SWEDISH_OVERRIDE: Record<string, LanguageOverride> = {
    Backquote: {
        legend: "§",
        description: "IntlBackslash;section",
    },
    Minus: {
        legend: "+",
        description: "plus",
    },
    Equal: {
        legend: "´",
        description: "acute accent",
    },
    BracketLeft: {
        legend: "å",
        description: "a ring",
    },
    BracketRight: {
        legend: "¨",
        description: "diaeresis",
    },
    Semicolon: {
        legend: "ö",
        description: "o umlaut",
    },
    Quote: {
        legend: "ä",
        description: "a umlaut",
    },
    Backslash: {
        legend: "'",
        description: "apostrophe",
    },
    IntlBackslash: {
        legend: "<",
        description: "less than",
    },
    Slash: {
        legend: "-",
        description: "minus",
    },
    NumpadDecimal: {
        legend: ",",
        description: "comma",
    },
};
