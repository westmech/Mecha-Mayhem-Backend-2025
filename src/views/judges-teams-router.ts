import { Router } from "express";
import { getRegisteredTeams, getInterviewTeams } from "../controllers/judges-teams-controller";
const router = Router();

// get all registered teams
router.get("/registered-teams", getRegisteredTeams);

// get teams that made it to interview stage
router.get("/interview-teams", getInterviewTeams);



export default router;