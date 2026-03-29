import type { RawKeyGeom } from '../../../features/keymap/keymap.types';

export const JIS_70_mainBlockGeom: RawKeyGeom[][] = [
    // Row 0 - F row & Extras
    [
        { code: "Escape" },
        { code: "F1" },
        { code: "F2" },
        { code: "F3" },
        { code: "F4" },
        { code: "F5" },
        { code: "F6" },
        { code: "F7" },
        { code: "F8" },
        { code: "F9" },
        { code: "F10" },
        { code: "F11" },
        { code: "F12" },
        { code: "Power" },
        { code: "Delete" },
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

    // Row 2
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
        { code: "Enter", w: 6 }, // JIS Enter Top-ish (approximated)
    ],

    // Row 3
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

    // Row 4
    [
        { code: "ShiftLeft", w: 5 },
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

    // Row 5
    [
        { code: "ControlLeft", w: 5 },
        { code: "Fn", w: 4 },
        { code: "MetaLeft", w: 4 },
        { code: "AltLeft", w: 4 },
        { code: "NonConvert", w: 4 }, // 無変換
        { code: "Space", w: 14 },
        { code: "Convert", w: 4 }, // 変換
        { code: "KanaMode", w: 4 }, // カタカナ/ひらがな
        { code: "AltRight", w: 4 },
        { code: "ContextMenu", w: 4 },
        {
            code: "arrow-cluster",
            type: "cluster",
            rows: [
                [
                    { code: "_spacer_up_l", type: "spacer", w: 4, h: 1 },
                    { code: "ArrowUp", h: 1 },
                    { code: "_spacer_up_r", type: "spacer", w: 4, h: 1 },
                ],
                [
                    { code: "ArrowLeft", h: 1 },
                    { code: "ArrowDown", h: 1 },
                    { code: "ArrowRight", h: 1 },
                ]
            ]
        }
    ],
];
