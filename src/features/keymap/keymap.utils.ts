import { type KeyGeom, type RawKeyGeom, type OSSelection, type RemapStore, type Layer, type KeyEntry } from './keymap.types';
import { VK_ANSI } from '../../components/keyboard/codes/virtual-keys/ansi';
import { VK_ISO } from '../../components/keyboard/codes/virtual-keys/iso';
import { VK_JIS } from '../../components/keyboard/codes/virtual-keys/jis';
import { VK_EXTRAS } from '../../components/keyboard/codes/extras';
import { UK_EMOJIS } from '../../components/keyboard/codes/unicodes/emojis';
import { type UKC, type VKC } from '../../components/keyboard/codes/code.help';
import { codePointsToUtf16, utf16ToCodePoints } from '../../utils/unicode';

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
    const allKeys = { ...vkcTable, ...VK_EXTRAS, ...UK_EMOJIS };

    newStore.remaps!.layers!.forEach((layer: Layer) => {
        if (!layer.keys) return;
        layer.keys.forEach((keyEntry: KeyEntry) => {
            const firstAction = keyEntry.actions?.[0];
            const rawCodes = firstAction?.codes?.[0];
            const outputType = firstAction?.outputType;
            if (rawCodes === undefined) return;

            const vkCodeHex = outputType === 'unicode' ? utf16ToCodePoints(rawCodes) : rawCodes;

            const vkcEntry = Object.values(allKeys).find(v => {
                const target = 'codePoints' in v
                    ? (v as UKC).codePoints
                    : (oldOS === 'WINDOWS' ? (v.windows ?? v.code) : (v.mac ?? v.code));

                if (Array.isArray(target)) {
                    return target.length === vkCodeHex.length && target.every((val, index) => val === vkCodeHex[index]);
                }
                // Single number target vs array: match if array has one element
                if (vkCodeHex.length === 1) {
                    return target === vkCodeHex[0];
                }
                return false;
            });

            if (vkcEntry) {
                const newCode = 'codePoints' in vkcEntry
                    ? (vkcEntry as UKC).codePoints
                    : (newOS === 'WINDOWS' ? ((vkcEntry as VKC).windows ?? (vkcEntry as VKC).code) : ((vkcEntry as VKC).mac ?? (vkcEntry as VKC).code)) as number | number[];

                const newCodesRaw = Array.isArray(newCode) ? newCode : [newCode];
                const finalCodes = outputType === 'unicode' ? codePointsToUtf16(newCodesRaw) : newCodesRaw;
                firstAction.codes = [finalCodes];

                // Also update the base key vkCode if needed (base keys are always single VKCs)
                const baseVkc = vkcTable[keyEntry.code];
                if (baseVkc) {
                    keyEntry.vkCode = (newOS === 'WINDOWS' ? (baseVkc.windows ?? baseVkc.code) : (baseVkc.mac ?? baseVkc.code)) as number;
                }
            }
        });
    });

    if (newStore.remaps) {
        if (!newStore.remaps.config) newStore.remaps.config = { language: 'english', layout: '', os: newOS };
        else newStore.remaps.config.os = newOS;
    }

    return newStore;
};

export const isUnknownMapping = (code: string, geometry: string, os: OSSelection, remapStore: RemapStore): boolean => {
    const layer = remapStore.remaps?.layers?.[0];
    const keyEntry = layer?.keys?.find((k) => k.code === code);
    if (!keyEntry?.actions || keyEntry.actions.length === 0) return false;

    let vkcTable = VK_ANSI;
    if (geometry.includes('iso')) vkcTable = VK_ISO;
    else if (geometry.includes('jis')) vkcTable = VK_JIS;
    const allKeys = { ...vkcTable, ...VK_EXTRAS, ...UK_EMOJIS };

    return keyEntry.actions.some(action => {
        const rawCodes = action.codes?.[0];
        const outputType = action.outputType;
        if (rawCodes === undefined) return false;

        const assignedCodes = outputType === 'unicode' ? utf16ToCodePoints(rawCodes) : rawCodes;

        const isKnown = Object.values(allKeys).some((v) => {
            const target = 'codePoints' in v
                ? (v as UKC).codePoints
                : (os === 'WINDOWS' ? (v.windows ?? v.code) : (v.mac ?? v.code));

            if (Array.isArray(target)) {
                return target.length === assignedCodes.length && target.every((val, index) => val === assignedCodes[index]);
            }
            // Single number target vs array: match if array has one element
            if (assignedCodes.length === 1) {
                return target === assignedCodes[0];
            }
            return false;
        });

        return !isKnown;
    });
};
