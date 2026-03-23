import type { RawKeyGeom } from '../../../features/keymap/keymap.types';

export const JIS_60_mainBlockGeom: RawKeyGeom[][] = [
    // Row 0 - Numbers
    [
        { code: "Backquote" }, // 半角/全角
        { code: "Digit1" },
        { code: "Digit2" },
        { code: "Digit3" },
        { code: "Digit4" },
        { code: "Digit5" },
        { code: "Digit6" },
        { code: "Digit7" },
        { code: "Digit8" },
        { code: "Digit9" },
        { code: "Digit0" },
        { code: "Minus" },
        { code: "Equal" }, // ^
        { code: "IntlYen" }, // ¥
        { code: "Backspace" },
    ],

    // Row 1
    [
        { code: "Tab", w: 6 },
        { code: "KeyQ" },
        { code: "KeyW" },
        { code: "KeyE" },
        { code: "KeyR" },
        { code: "KeyT" },
        { code: "KeyY" },
        { code: "KeyU" },
        { code: "KeyI" },
        { code: "KeyO" },
        { code: "KeyP" },
        { code: "BracketLeft" }, // @
        { code: "BracketRight" }, // [
        { code: "EnterTop", w: 6 }, // JIS Enter Top 1.5u
    ],

    // Row 2
    [
        { code: "CapsLock", w: 7 },
        { code: "KeyA" },
        { code: "KeyS" },
        { code: "KeyD" },
        { code: "KeyF" },
        { code: "KeyG" },
        { code: "KeyH" },
        { code: "KeyJ" },
        { code: "KeyK" },
        { code: "KeyL" },
        { code: "Semicolon" },
        { code: "Quote" }, // :
        { code: "Backslash" }, // ]
    ],

    // Row 3
    [
        { code: "ShiftLeft", w: 9 }, // 2.25u
        { code: "KeyZ" },
        { code: "KeyX" },
        { code: "KeyC" },
        { code: "KeyV" },
        { code: "KeyB" },
        { code: "KeyN" },
        { code: "KeyM" },
        { code: "Comma" },
        { code: "Period" },
        { code: "Slash" },
        { code: "IntlRo" }, // \
        { code: "ShiftRight", w: 7 }, // 1.75u
    ],

    // Row 4
    [
        { code: "ControlLeft", w: 5 }, // 1.25u
        { code: "MetaLeft", w: 4 },
        { code: "AltLeft", w: 4 },
        { code: "NonConvert", w: 4 }, // 無変換
        { code: "Space", w: 18 }, // 4.5u
        { code: "Convert", w: 4 }, // 変換
        { code: "KanaMode", w: 4 }, // カタカナ/ひらがな
        { code: "AltRight", w: 4 },
        { code: "MetaRight", w: 4 }, // Win Key in image
        { code: "ContextMenu", w: 4 },
        { code: "ControlRight", w: 5 }, // 1.25u
    ],
];
