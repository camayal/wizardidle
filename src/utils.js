// Wizard Idle v2 - small pure helpers (no game state, no DOM). Bodies unchanged from v1.

// True with the given probability (probBase + probExtra, from 0 to 1).
export function YesOrNot(probBase, probExtra) {
    return Math.random() <= Number(probBase) + Number(probExtra);
}

// Random integer between min and max, both included.
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A random item from a comma-separated list ("a,b,c").
export function pickRandomItem(localStorageItem) {
    const items = localStorageItem.split(",");
    const randomItem = items[Math.floor(Math.random() * items.length)];
    //select a random item
    return randomItem;
}

// Short number for display: 950, 1.20k, 3.45M, 1.00G.
export function roundNumbertoLetter(numberNoAbs) {
    const number = Math.abs(Number(numberNoAbs))
    let negative;
    Number(numberNoAbs) < -0.499999999999999 ?  negative = "-" : negative = "";
    if (number >= 0 && number < 1000) {
        return negative + Number(number).toFixed(0)
    } else if (number >= 1000 && number < 1000000) {
        return negative + Number(number / 1000).toFixed(2) + "k"
    } else if (number >= 1000000 && number < 1000000000) {
        return negative + Number(number / 1000000).toFixed(2) + "M"
    } else if (number >= 1000000000) {
        return negative + Number(number / 1000000000).toFixed(2) + "G"
    };

}

// First letter in uppercase.
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// A random #RRGGBB colour.
export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

// Seconds as a short duration: "1w 2d 3h 4m 5s".
export function secsToHours(segundos){
    const month_f = segundos / 2629750;
    const week_f = (month_f - parseInt(month_f)) * 4.34802865
    const day_f = (week_f - parseInt(week_f)) * 7
    const hour_f = (day_f - parseInt(day_f)) * 24
    const minutes_f = (hour_f - parseInt(hour_f)) * 60
    const seconds_f = (minutes_f - parseInt(minutes_f)) * 60
    const result =  (month_f >= 1 ?  `${Math.floor(month_f)}mo` : "") +
    (week_f >= 1 ?  ` ${Math.floor(week_f)}w` : "") +
    (day_f >= 1 ?  ` ${Math.floor(day_f)}d` : "") +
    (hour_f >= 1 ?  ` ${Math.floor(hour_f)}h` : "") +
    (minutes_f >= 1 ? ` ${Math.floor(minutes_f)}m` : "") +
    (Math.round(seconds_f) >= 1 ?  ` ${Math.round(seconds_f)}s` : "");
   return result;
}
