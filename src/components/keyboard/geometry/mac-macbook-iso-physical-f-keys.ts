import type { RawKeyGeom } from '../../../features/keymap/keymap.types';

export const ISO_laptop_fKeyRow: RawKeyGeom[][] = [
    // Row 1
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
        { code: "_spacer_power", w: 3, type: "spacer" },
    ],
    // Row 2
    [
        { code: "IntlBackslash" },
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
        { code: "Equal" },
        { code: "Backspace", w: 7 },
    ],
    // Row 3
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
        { code: "BracketLeft" },
        { code: "BracketRight" },
        { code: "EnterTop", w: 5 },
    ],
    // Row 4
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
        { code: "Quote" },
        { code: "Backslash" },
    ],
    // Row 5
    [
        { code: "ShiftLeft", w: 5 },
        { code: "Backquote" },
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
        { code: "ShiftRight", w: 10 },
    ],
    // Row 6
    [
        { code: "Fn" },
        { code: "ControlLeft" },
        { code: "AltLeft" },
        { code: "MetaLeft", w: 5 },
        { code: "Space", w: 20 },
        { code: "MetaRight", w: 5 },
        { code: "AltRight", w: 5 },
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
