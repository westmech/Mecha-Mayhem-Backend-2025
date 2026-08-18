// Provision team-portal login codes for a season.
//
// Usage (from the backend repo root, with .env configured):
//   node util/scripts/generateTeamLogins.js 2027
//
// For every team registered to the season's events (util/maps.js), this:
//   1. generates a unique login code (e.g. "MM27-210E-X7K2"),
//   2. writes a doc to the Firestore `teamLogins` collection
//      (doc ID = login code) with the fields the team portal expects,
//   3. writes team-logins-<year>.csv next to this script for distribution
//      (send each team its code ~2 weeks before the event).
//
// Re-running the script skips teams that already have a code (so it's safe
// to run again after late registrations) and re-exports the full CSV.

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });

// firebaseConfig resolves FIREBASE_FILE_LOC relative to the config dir
const { db } = require("../../config/firebaseConfig");
const { yearToEventIdsMap } = require("../maps");
const { concPagination } = require("../req/concPagination");
const { ROBOTEVENTS_BASE } = require("../req/requestRobotEvents");

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

const randomChunk = (len) =>
    Array.from({ length: len }, () =>
        CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
    ).join("");

async function main() {
    const year = process.argv[2];
    const events = yearToEventIdsMap[year];
    if (!events) {
        console.error(`No events configured for ${year} in util/maps.js`);
        process.exit(1);
    }

    const existing = new Map(); // team number -> {code, data}
    const snapshot = await db.collection("teamLogins").get();
    snapshot.forEach((doc) => existing.set(doc.data().number, { code: doc.id, ...doc.data() }));
    console.log(`${existing.size} existing login docs found`);

    const rows = [];
    for (const { id, division } of events) {
        const teams = await concPagination(
            `${ROBOTEVENTS_BASE}/events/${id}/teams?myTeams=false`
        );
        console.log(`event ${id} (${division ?? "single"}): ${teams.length} teams`);

        for (const team of teams) {
            if (existing.has(team.number)) {
                const prev = existing.get(team.number);
                rows.push([team.number, team.team_name, division ?? "", prev.code]);
                continue;
            }
            const code = `MM${String(year).slice(-2)}-${team.number}-${randomChunk(4)}`;
            await db.collection("teamLogins").doc(code).set({
                number: team.number,
                name: team.team_name ?? "",
                grade: team.grade ?? "",
                division: division ?? null,
                status: "NOT RESPONDED",
                interviewComplete: false,
                year: Number(year),
            });
            existing.set(team.number, { code });
            rows.push([team.number, team.team_name, division ?? "", code]);
            console.log(`  + ${team.number} -> ${code}`);
        }
    }

    const csv = ["team,name,division,loginCode"]
        .concat(rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")))
        .join("\n");
    const outPath = path.join(__dirname, `team-logins-${year}.csv`);
    fs.writeFileSync(outPath, csv);
    console.log(`\nWrote ${rows.length} rows to ${outPath}`);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
