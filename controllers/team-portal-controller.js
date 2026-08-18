const { db } = require("../config/firebaseConfig");

// Team portal login + judging-status flow.
//
// Teams log in with a login code distributed by the organizers before the
// event (see util/scripts/generateTeamLogins.js, which provisions a Firestore
// doc per registered team in the `teamLogins` collection — doc ID = login
// code). The frontend polls getSelectedTeam and posts status changes while
// judging is underway.

const VALID_STATUSES = ["NOT RESPONDED", "AWAY", "AT PIT"];

// GET /teams/get-selected-team/:teamID  (teamID = distributed login code)
const getSelectedTeam = async (req, res) => {
    const loginCode = req.params.teamID.trim().toUpperCase();

    try {
        const doc = await db.collection("teamLogins").doc(loginCode).get();
        if (!doc.exists) {
            return res
                .status(400)
                .json({ message: "Invalid login code. Please check the code your team received and try again." });
        }
        return res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error fetching team login:", error);
        return res.status(500).json({ message: "Failed to log in" });
    }
};

// POST /teams/selected-team-change-status  { teamID, newStatus }
const changeSelectedTeamStatus = async (req, res) => {
    const { teamID, newStatus } = req.body;

    if (!teamID || !VALID_STATUSES.includes(newStatus)) {
        return res.status(400).json({ message: "Invalid status update" });
    }

    try {
        const ref = db.collection("teamLogins").doc(String(teamID).trim().toUpperCase());
        const doc = await ref.get();
        if (!doc.exists) {
            return res.status(400).json({ message: "Invalid login code" });
        }
        await ref.update({ status: newStatus });
        return res.json({ id: doc.id, ...doc.data(), status: newStatus });
    } catch (error) {
        console.error("Error updating team status:", error);
        return res.status(500).json({ message: "Failed to update status" });
    }
};

module.exports = { getSelectedTeam, changeSelectedTeamStatus };
