import type { RawKeyGeom } from '../../../features/keymap/keymap.types';

export const ISO_mainBlockGeom: RawKeyGeom[][] = [
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
        { code: "Backquote" },
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
        { code: "Backspace", w: 8 },
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
        { code: "BracketLeft" },
        { code: "BracketRight" },
        { code: "Enter" },
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
        { code: "Quote" },
    ],

    // Row 4 - Third letter row
    [
        { code: "ShiftLeft", w: 5 },
        { code: "IntlBackslash" },
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
        { code: "ShiftRight", w: 8 },
    ],

    // Row 5 - Spacebar row
    [
        { code: "ControlLeft", w: 5 },
        { code: "MetaLeft", w: 5 },
        { code: "AltLeft", w: 5 },
        { code: "Space", w: 25 },
        { code: "AltRight", w: 5 },
        { code: "MetaRight", w: 5 },
        { code: "ContextMenu", w: 5 },
        { code: "ControlRight", w: 5 },
    ],
];

export const ISO_navBlockGeom: RawKeyGeom[][] = [
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