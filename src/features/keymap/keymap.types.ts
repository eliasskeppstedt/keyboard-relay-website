export type KeyCode = string;
export type OSSelection = 'WINDOWS' | 'MAC' | 'LINUX';
export type LanguageSelection = 'swedish' | 'english';
export type KeyboardStandard = 'ISO' | 'ANSI' | 'JIS';
export type KeyboardSize = '105' | 'F-Key Row' | '60%' | 'Macbook AIR'; // Expandable as needed

export interface KeyboardDefinition {
    id: string;
    name: string;
    standard: KeyboardStandard; // metadata
}

export type GeometrySelection = string; // Now refers to KeyboardDefinition.id

export type KeyType = 'key' | 'spacer' | 'cluster';

export interface RawKeyGeom {
    code: KeyCode;
    w?: number;
    h?: number;
    type?: KeyType;
    label?: string;
    x?: number;
    y?: number;
    rows?: RawKeyGeom[][];
}

export interface KeyGeom {
    code: KeyCode;
    w: number;
    h: number;
    type: KeyType;
    label?: string;
    x?: number;
    y?: number;
    rows?: KeyGeom[][];
}

export interface GlobalConfig {
    language: string;
    layout: string;
    os: string;
}

export interface PressAction {
    type: string;
    vkCode: string[];
}

export interface KeyAction {
    action: {
        press: PressAction;
    };
}

export interface Layer {
    name: string;
    id: number;
    config: Record<string, unknown>;
    keys: KeyAction[];
}

export interface RootConfiguration {
    remaps: {
        config: GlobalConfig;
        layers: Layer[];
        extras: Record<string, unknown>[];
    };
}

export interface RemapStore {
    remaps?: {
        layers?: Array<{
            name?: string;
            id?: number;
            config?: Record<string, unknown>;
            keys?: Array<{ code: string; action?: { press?: { type?: string; vkCode?: number[] } } }>;
        }>;
        config?: Record<string, unknown>;
        extras?: unknown[];
    };
}
