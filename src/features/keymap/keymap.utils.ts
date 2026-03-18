import type { KeyGeom, RawKeyGeom, OSSelection, RemapStore } from './keymap.types';
import { VK_ANSI } from '../../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../../components/keyboard/codes/virtual-keys/jis';

/**
 * Pure helper functions for keymap logic.
 */

export const normalizeLayout = (layout: RawKeyGeom[][]): KeyGeom[][] => {
    return layout.map(row => 
        row.map(key => ({
            ...key,
            w: key.w ?? 4,
            h: key.h ?? 2,
            type: key.type ?? 'key',
            rows: key.rows ? normalizeLayout(key.rows) : undefined
        }) as KeyGeom)
    );
};

export const flattenAndPosition = (rows: KeyGeom[][], startX = 1, startY = 1): KeyGeom[] => {
    const result: KeyGeom[] = [];
    const occupied = new Set<string>(); // "x,y"

    let rowY = startY;
    for (const row of rows) {
        let colX = startX;
        let maxRowH = 0;
        for (const key of row) {
            // Skip occupied cells
            while (occupied.has(`${colX},${rowY}`)) {
                colX++;
            }
            
            key.x = colX;
            key.y = rowY;
            
            if (key.type === 'cluster' && key.rows) {
                const children = flattenAndPosition(key.rows, colX, rowY);
                result.push(...children);
                // Determine bounding box for the cluster to mark it as occupied in parent
                if (children.length > 0) {
                    const childMaxX = Math.max(...children.map(c => (c.x || 0) + (c.w || 0)));
                    const childMaxY = Math.max(...children.map(c => (c.y || 0) + (c.h || 0)));
                    key.w = childMaxX - colX;
                    key.h = childMaxY - rowY;
                }
            } else if ((key.w || 0) > 0) {
                result.push(key);
            }

            // Mark cells as occupied
            for (let dy = 0; dy < (key.h || 0); dy++) {
                for (let dx = 0; dx < (key.w || 0); dx++) {
                    occupied.add(`${colX + dx},${rowY + dy}`);
                }
            }
            
            if ((key.h || 0) > maxRowH) maxRowH = key.h;
            colX += (key.w || 0);
        }
        // Advance to next row based on tallest key in this row (fallback to 2 units)
        rowY += maxRowH || 2;
    }
    return result;
};

export const getDisplayLabel = (key: KeyGeom): string => {
    return key.label || key.code;
};

export const isSpacer = (key: KeyGeom): boolean => {
    return key.type === 'spacer';
};

export const migrateRemapStore = (remapStore: RemapStore, oldOS: OSSelection, newOS: OSSelection, geometry: string): RemapStore => {
    if (!remapStore?.remaps?.layers) return remapStore;
    if (oldOS === newOS) return remapStore;

    let vkcTable = VK_ANSI;
    if (geometry.includes('iso')) vkcTable = VK_ISO;
    else if (geometry.includes('jis')) vkcTable = VK_JIS;

    const newStore: RemapStore = JSON.parse(JSON.stringify(remapStore));
    
    newStore.remaps!.layers!.forEach((layer) => {
        if (!layer.keys) return;
        layer.keys.forEach((keyEntry) => {
            const vkCodeHex = keyEntry.action?.press?.vkCode?.[0];
            if (vkCodeHex === undefined) return;

            const vkcEntry = Object.values(vkcTable).find(v => (oldOS === 'WINDOWS' ? v.windows : v.mac) === vkCodeHex);
            
            if (vkcEntry) {
                const newHex = (newOS === 'WINDOWS' ? vkcEntry.windows : vkcEntry.mac);
                keyEntry.action!.press!.vkCode = [newHex];
            }
        });
    });

    return newStore;
};
