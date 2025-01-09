import { Request, Response, NextFunction } from "express";
import {db} from "../config/firebaseConfig";

// get registered teams 
export const getRegisteredTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allTeamsRef = db.collection("2025").doc("all-teams");
        const allTeamsDoc = await allTeamsRef.get();
        const allTeams = allTeamsDoc.data();
        
        let validation = {
            0: 0,
            1: 0,
            2: 0
        };

        for (const [key, value] of Object.entries(allTeams)) {
            if (value.level === "0") validation[0]++;
            else if (value.level === "1") validation[1]++;
            else validation[2]++;
        }

        console.log(validation);

        res.send(allTeams);
    } catch (error) {
        console.log(`Error when fetching all registered teams: ${error}`);
        res.status(400).send("Error");
    }
};

// get teams that made it to interview stage
export const getInterviewTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamsSelectedInterviewRef = db.collection("2025").doc("teams-selected-for-interview");
        const teamsSelectedInterviewDoc = await teamsSelectedInterviewRef.get();
        const teamsSelectedInterview = teamsSelectedInterviewDoc.data();
        console.log(teamsSelectedInterview);

        res.send(teamsSelectedInterview);
    } catch (error) {
        console.log(`Error when fetching teams selected for interview: ${error}`);
        res.status(400).send("Error");
    }
};