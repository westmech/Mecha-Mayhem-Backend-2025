const express = require("express");
const { getInfo, getOPR, getAllTeams, getOneTeam, getSelectedTeam, changeSelectedTeamStatus } = require("../controllers/teams-controller");
const router = express.Router();

// route to retrieve team information for a season
router.get("/info/:teamNumber/:grade/:year", getInfo);

// route to retrieve team information for a season
router.get("/info/:year", getAllTeams);

// route to retrieve team information for a season
router.get("/info/:number/:year", getOneTeam);

// retrieve a teams OPR for a season
router.get("/opr/:teamNumber/:year/:division", getOPR);

// for selected teams - get data
router.get("/get-selected-team/:teamID", getSelectedTeam);

// for selected teams - change their status
router.post("/selected-team-change-status/:teamID", changeSelectedTeamStatus);

module.exports = router;
