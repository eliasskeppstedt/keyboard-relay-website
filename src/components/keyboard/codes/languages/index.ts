import { SWEDISH_OVERRIDE, type LanguageOverride } from './swedish';

export const LANGUAGES: Record<string, Record<string, LanguageOverride>> = {
    swedish: SWEDISH_OVERRIDE,
    english: {}, // Base English is handled by the virtual-keys data
};

export type { LanguageOverride };
