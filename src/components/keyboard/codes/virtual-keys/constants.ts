export interface VKC {
    mac?: number;
    windows?: number;
    code?: number;
    keyType: "VKC" | "EC";
    legend?: string;
    description?: string;
    showDescription?: boolean;
}

export const UNSUPPORTED_CODE = 0x12C; // 300
