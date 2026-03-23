import type { RawKeyGeom } from '../../../features/keymap/keymap.types';

export const JIS_mainBlockGeom: RawKeyGeom[][] = [
    // Row 0 - Esc & F-keys
    [
        { code: "Escape" },
        { code: "_gap1", type: "spacer" },
        { code: "F1" },
        { code: "F2" },
        { code: "F3" },
        { code: "F4" },
        { code: "_gap2", w: 2, type: "spacer" },
        { code: "F5" },
        { code: "F6" },
        { code: "F7" },
        { code: "F8" },
        { code: "_gap3", w: 2, type: "spacer" },
        { code: "F9" },
        { code: "F10" },
        { code: "F11" },
        { code: "F12" },
    ],
    // Row 1 - Numbers
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
    // Row 2 - First letter row
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
        { code: "EnterTop", w: 6 },
    ],
    // Row 3 - Second letter row
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
    // Row 4 - Third letter row
    [
        { code: "ShiftLeft", w: 9 },
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
        { code: "ShiftRight", w: 7 },
    ],
    // Row 5 - Spacebar row
    [
        { code: "ControlLeft", w: 5 },
        { code: "MetaLeft", w: 4 }, // Win
        { code: "AltLeft", w: 4 },
        { code: "NonConvert", w: 4 }, // 無変換
        { code: "Space", w: 18 },
        { code: "Convert", w: 4 }, // 変換
        { code: "KanaMode", w: 4 }, // カタカナ/ひらがな
        { code: "AltRight", w: 4 },
        { code: "MetaRight", w: 4 }, // Win
        { code: "ContextMenu", w: 4 },
        { code: "ControlRight", w: 5 },
    ],
];

export const JIS_navBlockGeom: RawKeyGeom[][] = [
    // Row 0
    [
        { code: "PrintScreen" },
        { code: "ScrollLock" },
        { code: "Pause" },
    ],
    // Row 1
    [
        { code: "Insert" },
        { code: "Home" },
        { code: "PageUp" },
    ],
    // Row 2
    [
        { code: "Delete" },
        { code: "End" },
        { code: "PageDown" },
    ],
    // Row 3
    [
        { code: "_empty1", type: "spacer" },
        { code: "keyInvisible" },
        { code: "_empty3", type: "spacer" },
    ],
    // Row 5
    [
        { code: "_empty4", type: "spacer" },
        { code: "ArrowUp" },
        { code: "_empty5", type: "spacer" },
    ],
    // Row 6
    [
        { code: "ArrowLeft" },
        { code: "ArrowDown" },
        { code: "ArrowRight" },
    ]
];

export const JIS_numpadBlockGeom: RawKeyGeom[][] = [
    // Row 0
    [
        { code: "_space", w: 16, type: "spacer" }
    ],
    // Row 1
    [
        { code: "NumLock" },
        { code: "NumpadDivide" },
        { code: "NumpadMultiply" },
        { code: "NumpadSubtract" },
    ],
    // Row 2
    [
        { code: "Numpad7" },
        { code: "Numpad8" },
        { code: "Numpad9" },
        { code: "NumpadAdd" },
    ],
    // Row 3
    [
        { code: "Numpad4" },
        { code: "Numpad5" },
        { code: "Numpad6" },
    ],
    // Row 4
    [
        { code: "Numpad1" },
        { code: "Numpad2" },
        { code: "Numpad3" },
        { code: "NumpadEnter" },
    ],
    // Row 5
    [
        { code: "Numpad0", w: 8 },
        { code: "NumpadDecimal" },
    ]
];
