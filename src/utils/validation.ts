export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateRemapJson(json: unknown): ValidationResult {
    if (!json || typeof json !== 'object') {
        return { isValid: false, error: 'Invalid JSON format' };
    }

    const obj = json as Record<string, unknown>;

    // Check for core structure
    if (!obj.remaps || typeof obj.remaps !== 'object') {
        return { isValid: false, error: 'JSON file does not comply with remap structure (missing "remaps" object)' };
    }

    const remaps = obj.remaps as Record<string, unknown>;

    if (!Array.isArray(remaps.layers)) {
        return { isValid: false, error: 'JSON file does not comply with remap structure (missing "layers" array)' };
    }

    // Basic check for at least one layer content if it's not empty
    for (const layer of remaps.layers) {
        if (!layer || typeof layer !== 'object') {
            return { isValid: false, error: 'Invalid layer definition detected' };
        }
        const l = layer as Record<string, unknown>;
        if (typeof l.name !== 'string' || typeof l.id !== 'number') {
            return { isValid: false, error: 'Layer metadata (name/id) missing or invalid' };
        }
        if (l.keys && !Array.isArray(l.keys)) {
            return { isValid: false, error: 'Layer keys must be an array' };
        }
        
        // Check key structure if present
        if (Array.isArray(l.keys)) {
            for (const key of l.keys) {
                const k = key as Record<string, unknown>;
                if (!k.code || (!k.actions && !k.action)) {
                    return { isValid: false, error: 'Key entry missing "code" or "actions"' };
                }
            }
        }
    }

    return { isValid: true };
}
