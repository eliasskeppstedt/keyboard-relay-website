import { SWEDISH_OVERRIDE, type LanguageOverride } from './swedish';
import { GERMAN_OVERRIDE } from './german';
import { SPANISH_OVERRIDE } from './spanish';
import { RUSSIAN_OVERRIDE } from './russian';
import { KOREAN_OVERRIDE } from './korean';
import { JAPANESE_OVERRIDE } from './japanese';

export const LANGUAGES: Record<string, Record<string, LanguageOverride>> = {
    swedish: SWEDISH_OVERRIDE,
    english: {},
    german: GERMAN_OVERRIDE,
    japanese: JAPANESE_OVERRIDE,
    korean: KOREAN_OVERRIDE,
    russian: RUSSIAN_OVERRIDE,
    spanish: SPANISH_OVERRIDE,
};

export type { LanguageOverride };
