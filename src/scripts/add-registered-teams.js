const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_FILE_SCRIPTS_LOC);
const {getAllRegisteredTeamsData} = require("../util/req/getTeamInfo");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
  
// Initialize Firestore
const db = admin.firestore();
const allTeamsRef = db.collection("2025").doc("all-teams");

const events = {
    0 : 55504, // High School
    1 : 55505, // Middle School
    2 : 55506 // College
}

const addRegisteredTeams = async () => {
    let registeredTeams = {};
    try {
        for (const event in events) {
            // team data
            const teams = await getAllRegisteredTeamsData(event, events[event]);
            registeredTeams = {...registeredTeams, ...teams};

            console.log(`There are this many teams of event ${event}: ${Object.keys(teams).length}`);
        }

        // saving to firebase db
        allTeamsRef.set(registeredTeams);
        console.log("Successfully added all registered teams to firebase");
    } catch (error) {
        console.log(`Error when adding teams to db: ${error}`);
    }
};

addRegisteredTeams();
