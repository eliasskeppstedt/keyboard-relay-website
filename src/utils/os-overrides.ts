import type { OSSelection } from '../features/keymap/keymap.types';

export interface OSOverride {
    legend?: string;
    description?: string;
}

export const OS_OVERRIDES: Record<OSSelection, Record<string, OSOverride>> = {
    WINDOWS: {
        'MetaLeft': { legend: 'L win', description: 'left windows;left super' },
        'MetaRight': { legend: 'R win', description: 'right windows;rigth super' },
        'AltLeft': { legend: 'Alt' },
        'AltRight': { legend: 'AltGr' },
        'ControlLeft': { legend: 'L ctrl', description: 'left control' },
        'ControlRight': { legend: 'R ctrl', description: 'right control' }
    },
    LINUX: {
        'MetaLeft': { legend: 'L meta', description: 'left meta;left super' },
        'MetaRight': { legend: 'R meta', description: 'right meta;right super' },
        'AltLeft': { legend: 'Alt' },
        'AltRight': { legend: 'AltGr' },
        'ControlLeft': { legend: 'L ctrl', description: 'left control' },
        'ControlRight': { legend: 'R ctrl', description: 'right control' }
    },
    MAC: {
        // Mac typically uses the default legends from the VKC tables, 
        // but we can add overrides here if needed.
    }
};

export function getOSOverride(os: OSSelection, code: string): OSOverride | undefined {
    return OS_OVERRIDES[os]?.[code];
}
