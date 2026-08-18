// Season-to-RobotEvents lookup tables. Event IDs are the numeric IDs used by
// the events.vex.com API — find them in an event page's HTML/network requests
// (search for "events/<id>"), not the RE-V5RC-... SKU.
const yearToKeyMap = {
    2023: 47800,
    2024: 51496,
    2025: 55504,
    2026: 60091,
    2027: 64355
}; // UPDATE WITH EACH NEW YEAR (primary/HS event ID; other divisions live in yearToEventIdsMap)

// A year can span multiple RobotEvents events (separate HS and MS divisions
// since 2025; VEX IQ ES/MS Blended added in 2027). Used by the awards flow so
// every division's winners are included.
const yearToEventIdsMap = {
    2023: [{ id: 47800, division: null }],
    2024: [{ id: 51496, division: null }],
    2025: [{ id: 55504, division: "HS" }, { id: 55505, division: "MS" }],
    2026: [{ id: 60091, division: "HS" }, { id: 60291, division: "MS" }],
    2027: [
        { id: 64355, division: "HS" },   // RE-V5RC-26-4355
        { id: 64356, division: "MS" },   // RE-V5RC-26-4356
        { id: 64485, division: "IQ" },   // RE-VIQRC-26-4485 (ES/MS Blended)
        { id: 64357, division: "U" },    // RE-VURC-26-4357 (VEX U Collegiate)
    ],
};

const divToKeyMap = {
    prairies: 1,
    rockies: 2,
    finals: 100,
};

const roundToKeyMap = {
    practice: "round%5B%5D=1",
    qualification: "round%5B%5D=2",
    eliminations: "round%5B%5D=3&round%5B%5D=4&round%5B%5D=5&round%5B%5D=6",
};

const gradeToKeyMap = {
    MS: "&grade%5B%5D=Middle%20School&myTeams=false",
    HS: "&grade%5B%5D=High%20School&myTeams=false",
    UNI: "&grade%5B%5D=College&myTeams=false",
};

module.exports = { yearToKeyMap, yearToEventIdsMap, divToKeyMap, roundToKeyMap, gradeToKeyMap }