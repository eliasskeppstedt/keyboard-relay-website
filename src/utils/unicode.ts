/**
 * Converts Unicode code points to UTF-16 code units.
 * Necessary for the remap engine which expects UTF-16 units.
 */
export function codePointsToUtf16(codePoints: number[]): number[] {
    return String.fromCodePoint(...codePoints).split('').map(c => c.charCodeAt(0));
}

/**
 * Converts UTF-16 code units back to Unicode code points.
 * Useful for matching JSON data against internal tables that use code points.
 */
export function utf16ToCodePoints(utf16Units: number[]): number[] {
    const str = String.fromCharCode(...utf16Units);
    return Array.from(str).map(c => c.codePointAt(0) as number);
}
