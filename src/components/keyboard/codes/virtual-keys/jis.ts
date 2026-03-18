import { VK_ANSI } from './ansi';
import { NO_VKC, type VKC } from './constants';

export const VK_JIS: Record<string, VKC> = {
    ...VK_ANSI,
    IntlBackslash: {
        mac: 0x0A,
        windows: NO_VKC,
        keyType: "VKC",
        legend: "\\",
        description: "backslash"
    },
    Lang1: {
        mac: 0x68,
        windows: 0x15,
        keyType: "VKC",
        legend: "あ",
        description: "kana;lang1"
    },
    Lang2: {
        mac: 0x66,
        windows: NO_VKC,
        keyType: "VKC",
        legend: "英",
        description: "eisu;lang2"
    },
    IntlYen: {
        mac: 0x5D,
        windows: NO_VKC,
        keyType: "VKC",
        legend: "¥",
        description: "yen"
    },
    IntlRo: {
        mac: 0x5E,
        windows: NO_VKC,
        keyType: "VKC",
        legend: "_",
        description: "underscore"
    },
    Convert: {
        mac: NO_VKC,
        windows: 0x1C,
        keyType: "VKC",
        legend: "変換",
        description: "convert"
    },
    NonConvert: {
        mac: NO_VKC,
        windows: 0x1D,
        keyType: "VKC",
        legend: "無変換",
        description: "nonconvert"
    },
};
