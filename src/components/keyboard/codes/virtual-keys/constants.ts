export const NO_VKC = 300;

export interface VKC {
    mac: number;
    windows: number;
    keyType: "VKC";
    legend?: string;
    description?: string;
    showDescription?: boolean;
}
