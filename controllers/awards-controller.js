const admin = require("firebase-admin");
const { db } = require("../config/firebaseConfig");
const { yearToEventIdsMap } = require("../util/maps");
const { ROBOTEVENTS_BASE } = require("../util/req/requestRobotEvents");
const { concPagination } = require("../util/req/concPagination");
const { transformTeams } = require("../util/transformers/transformTeams");
const { transformAwards } = require("../util/transformers/transformAwards");

// Set true temporarily (local dev only) to bypass the Firestore cache and
// re-fetch from RobotEvents, e.g. after an event's results are corrected.
const overwriteCachedData = false;

// Bump to invalidate previously cached award docs (v2: division labels + HS/MS merge)
const CACHE_VERSION = 2;

const getAwardsByYear = async (req, res) => {
    const year = req.params.year;

    const events = yearToEventIdsMap[year];
    if (!events) {
        return res.status(404).json({ error: `No event found for ${year}` });
    }

    try {
        // Check if exists in FireStore Cache
        const awardsRef = db.collection("awards").doc(year);
        const doc = await awardsRef.get();

        if (doc.exists && doc.data().version === CACHE_VERSION && !overwriteCachedData) {
            console.log("Returning cached awards data");
            return res.json(doc.data().awards);
        }

        // Request from RobotEvents API and cache. Years since 2025 span two
        // events (HS and MS divisions); merge their award lists.
        console.log("Fetching new awards data from API");
        const transformedAwards = [];
        for (const { id, division } of events) {
            const awards = await concPagination(`${ROBOTEVENTS_BASE}/events/${id}/awards`);
            const roster = transformTeams(
                await concPagination(`${ROBOTEVENTS_BASE}/events/${id}/teams?myTeams=false`)
            );
            transformedAwards.push(...transformAwards(awards, roster, division));
        }

        // Save to Firestore — but never cache an empty list (an upcoming
        // event has no awards yet; caching [] would keep serving it after
        // the event happens).
        if (transformedAwards.length > 0) {
            await awardsRef.set({
                awards: transformedAwards,
                version: CACHE_VERSION,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        res.json(transformedAwards);
    } catch (error) {
        console.error("Error fetching awards:", error);
        res.status(500).json({ error: "Failed to fetch awards" });
    }
}

module.exports = { getAwardsByYear }
