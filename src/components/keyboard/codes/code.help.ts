export interface VKC {
    mac?: number;
    windows?: number;
    code?: number | string;
    eCode?: number;
    keyType: "VKC" | "EC" | "UNICODE";
    legend?: string;
    description?: string;
    showDescription?: boolean;
}

export interface UKC {
    codePoints: number[];
    legend: string;
    description: string;
}

export const UNSUPPORTED_CODE = 0x12C; // magic number,,, uh