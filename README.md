# keyboard-relay-website
Web interface used to prouce a configuration file for Keyboard ReLay.

App is managed in this repository: https://github.com/eliasskeppstedt/keyboard-relay-app

## Current state
The remapping tool can now generate a map that lets you redifine what happens when a key is pressed.  
Keyboards: 
- Generic ISO 105
- MacBook ISO keyboard with physical F keys

Languages:
- Swedish
- English

Note: Key codes that are currently used (virtual key codes) are not universal for all languages
It is possible to edit the codes manually in the json file. To change the code, you can create a 
mapping of your liking and download it. Open in in notepad and find the key elements which looks 
like this
```json
"keys": [
    {
        "code": "KeyQ",
        "action": {
            "press": {
                "type": "VKC",
                "vkCode": [
                    186
                ]
            }
        }
    }
]
```
and change the number in the "vkCode" field to a relevant code for your language. If you for example have
the spanish layout and want to change the letter "q" to "ñ", you would set the virtual key code 
to 186 as the example show.
Lists of virtual key codes for each language can be found here: 
- [Windows](https://kbdlayout.info/)

## Future (goals)
The goal of this website is to offer an easy way to configure a custom configuration for your keyboard, where all the complications about how the structure needs to be is abstracted away. Without going into much grater detail, it is going to work by key codes that may differ depending on layout and languagte input. Therefore the user needs to choose a keyboard layout and input language to start mapping. Each key should be able to be mapped for an action, which is defined by what [Keyboard ReLay](https://github.com/eliasskeppstedt/keyboard-relay-app) supports. You should be able to upload an existing configuration file to edit an old mapping, or create a new one. The file currently being edited will be visible in a text field, which is what the mapping file will contain when you download it (json file).

To identify a character, Keyboard ReLay uses (virtual) key codes. These are the codes that are language specific which is why the user must choose a language. The app also supports unicodes, which is universal for all languages (the limitation is rather an applications character support). As such unicodes will also be available in mappings. They work a bit different, while a character produced by a keycode can be modified by ex shift or ctrl (as normal keys can), a unicode is a code that defines a specific character and that character only. So if you map a key to a unicode, it will not be modified by anything.

