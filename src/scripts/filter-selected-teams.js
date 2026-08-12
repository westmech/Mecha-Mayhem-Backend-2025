const dotenv = require('dotenv');
dotenv.config();
const { db } = require("../config/firebaseConfig");

const allTeamsRef = db.collection("2025").doc("all-teams");
const selectedTeamsRef = db.collection("2025").doc("teams-passed-preliminary-round");
const filteredTeamsRef = db.collection("2025").doc("teams-selected-for-interview");

const filterTeamsForInterview = async () => {
    let filteredTeams = {};
    try {
        const selectedTeamsDoc = await selectedTeamsRef.get();
        const selectedTeams = new Set(selectedTeamsDoc.data().teams);

        const allTeamsDoc = await allTeamsRef.get();
        const allTeams = allTeamsDoc.data();

        console.log(selectedTeams);

        for (const [key, value] of Object.entries(allTeams)) {
            console.log(value.number);
            if (selectedTeams.has(value.number)) {
                filteredTeams = {...filteredTeams, [key]: {...value, status: "NOT RESPONDED", interviewComplete: false}};
            } 
        };

        console.log(filteredTeams);

        filteredTeamsRef.set(filteredTeams);
        console.log("Successfully added teams selected for interview");
    } catch (error) {
        console.log(`Error when filtering teams selected for interview: ${error}`);
    }
};

filterTeamsForInterview();