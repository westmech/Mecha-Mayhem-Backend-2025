import { Router } from "express";
import { changeInterviewStatus, getRegisteredTeams, getSelectedTeams } from "../controllers/judges-portal-controller";
const router = Router();

// get all registered teams
router.get("/registered-teams", getRegisteredTeams);

// get teams that made it to interview stage
router.get("/selected-teams", getSelectedTeams);

router.post("/change-interview-status", changeInterviewStatus);

export default router;