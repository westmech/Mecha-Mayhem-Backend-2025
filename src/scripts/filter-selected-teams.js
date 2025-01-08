const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_FILE_SCRIPTS_LOC);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
  
// Initialize Firestore
const db = admin.firestore();
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

        // console.log(allTeams);

        for (const [key, value] of Object.entries(allTeams)) {
            if (selectedTeams.has(value.number)) {
                filteredTeams = {...filteredTeams, [key]: value};
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