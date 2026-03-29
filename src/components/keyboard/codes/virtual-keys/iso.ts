import { VK_ANSI } from './ansi';
import { type VKC } from '../code.help.ts';

export const VK_ISO: Record<string, VKC> = {
    ...VK_ANSI,
    IntlBackslash: {
        mac: 0x0A,
        windows: 0xE2,
        keyType: "VKC",
        legend: "§",
        description: "IntlBackslash;section"
    },
};
