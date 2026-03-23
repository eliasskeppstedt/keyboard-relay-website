import { type VKC, UNSUPPORTED_CODE } from './constants';

export const VK_SHARED: Record<string, VKC> = {
    Enter: {
        mac: 0x24,
        windows: 0x0D,
        keyType: "VKC",
        legend: "⏎",
        description: "enter"
    },
    EnterTop: {
        mac: 0x24,
        windows: 0x0D,
        keyType: "VKC",
        legend: "⏎",
        description: "enter"
    },
    Tab: {
        mac: 0x30,
        windows: 0x09,
        keyType: "VKC",
        legend: "tab"
    },
    Space: {
        mac: 0x31,
        windows: 0x20,
        keyType: "VKC",
        legend: "␣",
        description: "space"
    },
    Backspace: {
        mac: 0x33,
        windows: 0x08,
        keyType: "VKC",
        legend: "⌫",
        description: "backspace"
    },
    Escape: {
        mac: 0x35,
        windows: 0x1B,
        keyType: "VKC",
        legend: "esc",
        description: "escape"
    },
    MetaRight: {
        mac: 0x36,
        windows: 0x5C,
        keyType: "VKC",
        legend: "R ⌘",
        description: "R cmd;right command"
    },
    MetaLeft: {
        mac: 0x37,
        windows: 0x5B,
        keyType: "VKC",
        legend: "L ⌘",
        description: "L cmd;left command"
    },
    ShiftLeft: {
        mac: 0x38,
        windows: 0xA0,
        keyType: "VKC",
        legend: "L ⇧",
        description: "L shift;left shift"
    },
    CapsLock: {
        mac: 0x39,
        windows: 0x14,
        keyType: "VKC",
        legend: "caps lock"
    },
    AltLeft: {
        mac: 0x3A,
        windows: 0xA4,
        keyType: "VKC",
        legend: "L ⌥",
        description: "L opt;left option"
    },
    ControlLeft: {
        mac: 0x3B,
        windows: 0xA2,
        keyType: "VKC",
        legend: "L ⌃",
        description: "L ctrl;left control"
    },
    ShiftRight: {
        mac: 0x3C,
        windows: 0xA1,
        keyType: "VKC",
        legend: "R ⇧",
        description: "R shift;right shift"
    },
    AltRight: {
        mac: 0x3D,
        windows: 0xA5,
        keyType: "VKC",
        legend: "R ⌥",
        description: "R opt;right option"
    },
    ControlRight: {
        mac: 0x3E,
        windows: 0xA3,
        keyType: "VKC",
        legend: "R ⌃",
        description: "R ctrl;right control"
    },
    F17: {
        mac: 0x40,
        windows: 0x80,
        keyType: "VKC",
        legend: "F17",
    },
    AudioVolumeUp: {
        mac: 0x48,
        windows: 0xAF,
        keyType: "VKC",
        legend: "🔊",
        description: "vol up;volume up"
    },
    AudioVolumeDown: {
        mac: 0x49,
        windows: 0xAE,
        keyType: "VKC",
        legend: "🔉",
        description: "vol down;volume down"
    },
    AudioVolumeMute: {
        mac: 0x4A,
        windows: 0xAD,
        keyType: "VKC",
        legend: "🔇",
        description: "mute"
    },
    F18: {
        mac: 0x4F,
        windows: 0x81,
        keyType: "VKC",
        legend: "F18",
    },
    F19: {
        mac: 0x50,
        windows: 0x82,
        keyType: "VKC",
        legend: "F19",
    },
    F20: {
        mac: 0x5A,
        windows: 0x83,
        keyType: "VKC",
        legend: "F20",
    },
    F5: {
        mac: 0x60,
        windows: 0x74,
        keyType: "VKC",
        legend: "F5",
    },
    F6: {
        mac: 0x61,
        windows: 0x75,
        keyType: "VKC",
        legend: "F6",
    },
    F7: {
        mac: 0x62,
        windows: 0x76,
        keyType: "VKC",
        legend: "F7",
    },
    F3: {
        mac: 0x63,
        windows: 0x72,
        keyType: "VKC",
        legend: "F3",
    },
    F8: {
        mac: 0x64,
        windows: 0x77,
        keyType: "VKC",
        legend: "F8",
    },
    F9: {
        mac: 0x65,
        windows: 0x78,
        keyType: "VKC",
        legend: "F9",
    },
    F11: {
        mac: 0x67,
        windows: 0x7A,
        keyType: "VKC",
        legend: "F11",
    },
    F13: {
        mac: 0x69,
        windows: 0x7C,
        keyType: "VKC",
        legend: "F13",
    },
    F16: {
        mac: 0x6A,
        windows: 0x7F,
        keyType: "VKC",
        legend: "F16",
    },
    F14: {
        mac: 0x6B,
        windows: 0x7D,
        keyType: "VKC",
        legend: "F14",
    },
    F10: {
        mac: 0x6D,
        windows: 0x79,
        keyType: "VKC",
        legend: "F10",
    },
    ContextMenu: {
        mac: 0x6E,
        windows: 0x5D,
        keyType: "VKC",
        legend: "Menu",
        description: "context menu"
    },
    F12: {
        mac: 0x6F,
        windows: 0x7B,
        keyType: "VKC",
        legend: "F12",
    },
    F15: {
        mac: 0x71,
        windows: 0x7E,
        keyType: "VKC",
        legend: "F15",
    },
    Insert: {
        mac: 0x72,
        windows: 0x2D,
        keyType: "VKC",
        legend: "Ins",
        description: "insert"
    },
    Home: {
        mac: 0x73,
        windows: 0x24,
        keyType: "VKC",
        legend: "Home",
    },
    PageUp: {
        mac: 0x74,
        windows: 0x21,
        keyType: "VKC",
        legend: "PgUp",
        description: "page up"
    },
    Delete: {
        mac: 0x75,
        windows: 0x2E,
        keyType: "VKC",
        legend: "⌦",
        description: "del;delete"
    },
    F4: {
        mac: 0x76,
        windows: 0x73,
        keyType: "VKC",
        legend: "F4",
    },
    End: {
        mac: 0x77,
        windows: 0x23,
        keyType: "VKC",
        legend: "End",
    },
    F2: {
        mac: 0x78,
        windows: 0x71,
        keyType: "VKC",
        legend: "F2",
    },
    PageDown: {
        mac: 0x79,
        windows: 0x22,
        keyType: "VKC",
        legend: "PgDn",
        description: "page down"
    },
    F1: {
        mac: 0x7A,
        windows: 0x70,
        keyType: "VKC",
        legend: "F1",
    },
    ArrowLeft: {
        mac: 0x7B,
        windows: 0x25,
        keyType: "VKC",
        legend: "←",
        description: "arrow left"
    },
    ArrowRight: {
        mac: 0x7C,
        windows: 0x27,
        keyType: "VKC",
        legend: "→",
        description: "arrow right"
    },
    ArrowDown: {
        mac: 0x7D,
        windows: 0x28,
        keyType: "VKC",
        legend: "↓",
        description: "arrow down"
    },
    ArrowUp: {
        mac: 0x7E,
        windows: 0x26,
        keyType: "VKC",
        legend: "↑",
        description: "arrow up"
    },
    /*Sleep: {
        mac: UNSUPPORTED_CODE,
        windows: 0x5F,
        keyType: "VKC",
        legend: "Sleep",
        description: "sleep"
    },*//*
    BrowserBack: {
        mac: UNSUPPORTED_CODE,
        windows: 0xA6,
        keyType: "VKC",
        legend: "Back",
        description: "browser back"
    },*//*
    BrowserForward: {
        mac: UNSUPPORTED_CODE,
        windows: 0xA7,
        keyType: "VKC",
        legend: "Fwd",
        description: "browser forward"
    },*//*
    BrowserRefresh: {
        mac: UNSUPPORTED_CODE,
        windows: 0xA8,
        keyType: "VKC",
        legend: "Refr",
        description: "browser refresh"
    },*//*
    BrowserStop: {
        mac: UNSUPPORTED_CODE,
        windows: 0xA9,
        keyType: "VKC",
        legend: "Stop",
        description: "browser stop"
    },*//*
    BrowserSearch: {
        mac: UNSUPPORTED_CODE,
        windows: 0xAA,
        keyType: "VKC",
        legend: "Search",
        description: "browser search"
    },*//*
    BrowserFavorites: {
        mac: UNSUPPORTED_CODE,
        windows: 0xAB,
        keyType: "VKC",
        legend: "Favs",
        description: "browser favorites"
    },*//* 
    BrowserHome: {
        mac: UNSUPPORTED_CODE,
        windows: 0xAC,
        keyType: "VKC",
        legend: "Home",
        description: "browser home"
    },*//* 
    MediaTrackNext: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB0,
        keyType: "VKC",
        legend: "⏭",
        description: "media;next track"
    },*//* 
    MediaTrackPrevious: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB1,
        keyType: "VKC",
        legend: "⏮",
        description: "media;previous track"
    },*//* 
    MediaStop: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB2,
        keyType: "VKC",
        legend: "⏹",
        description: "media;stop"
    },*//* 
    MediaPlayPause: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB3,
        keyType: "VKC",
        legend: "⏯",
        description: "media;play pause"
    },*//* 
    LaunchMail: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB4,
        keyType: "VKC",
        legend: "Mail",
        description: "launch mail"
    },*//* 
    LaunchMediaSelect: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB5,
        keyType: "VKC",
        legend: "Media",
        description: "launch media select"
    },*//* 
    LaunchApp1: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB6,
        keyType: "VKC",
        legend: "App1",
        description: "launch app 1"
    },*//* 
    LaunchApp2: {
        mac: UNSUPPORTED_CODE,
        windows: 0xB7,
        keyType: "VKC",
        legend: "App2",
        description: "launch app 2"
    },*/
    PrintScreen: {
        mac: UNSUPPORTED_CODE,
        windows: 0x2C,
        keyType: "VKC",
        legend: "PrtScn",
        description: "print screen"
    },
    ScrollLock: {
        mac: UNSUPPORTED_CODE,
        windows: 0x91,
        keyType: "VKC",
        legend: "ScrLk",
        description: "scroll lock"
    },/* 
    Pause: {
        mac: UNSUPPORTED_CODE,
        windows: 0x13,
        keyType: "VKC",
        legend: "Pb",
        description: "pause;break"
    },*//* 
    ModeChange: {
        mac: UNSUPPORTED_CODE,
        windows: 0x1F,
        keyType: "VKC"
    },*/
};
