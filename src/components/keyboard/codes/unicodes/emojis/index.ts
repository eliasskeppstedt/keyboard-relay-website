import { UK_SMILEYS } from './smileys-people';
import { UK_ANIMALS_NATURE } from './animals-nature';
import { UK_FOOD_DRINKS } from "./food-drinks";
import { UK_ACTIVITIES } from "./activities";
import { UK_TRAVEL_PLACES } from "./travel-places";
import { UK_OBJECTS } from "./objects";
import { UK_SYMBOLS } from "./symbols";

export {
    UK_SMILEYS,
    UK_ANIMALS_NATURE,
    UK_FOOD_DRINKS,
    UK_ACTIVITIES,
    UK_TRAVEL_PLACES,
    UK_OBJECTS,
    UK_SYMBOLS
};

import { type UKC } from '../../code.help';

export const UK_EMOJIS: Record<string, UKC> = {
    ...UK_SMILEYS,
    ...UK_ANIMALS_NATURE,
    ...UK_FOOD_DRINKS,
    ...UK_ACTIVITIES,
    ...UK_TRAVEL_PLACES,
    ...UK_OBJECTS,
    ...UK_SYMBOLS,
};

/*function generateEmojiMap(input: string): void {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

    const emojis = [...segmenter.segment(input)]
        .map(s => s.segment)
        .filter(e => /\p{Emoji}/u.test(e));

    function getCodePoints(str: string): number[] {
        const cps: number[] = [];
        for (let i = 0; i < str.length;) {
            const cp = str.codePointAt(i)!;
            cps.push(cp);
            i += cp > 0xffff ? 2 : 1;
        }
        return cps;
    }

    function toHex(cp: number): string {
        return cp.toString(16).toUpperCase();
    }

    const seen = new Set<string>(); // undvik duplicates

    emojis.forEach(e => {
        const cps = getCodePoints(e);
        const key = "u" + cps.map(toHex).join("_");

        if (seen.has(key)) return;
        seen.add(key);

        console.log(`${key}: {
  codePoints: [${cps.join(", ")}],
  legend: "${e}",
  description: ""
},`);
    });
}

generateEmojiMap();*/