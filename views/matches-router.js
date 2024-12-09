const express = require("express");
const { getAllMatches, streamAllMatches } = require("../controllers/matches-controller");
const router = express.Router();

// Route to retrieve awards by the year - paginated
router.post("/:year/:division/", streamAllMatches);

// Route to retrieve awards by the year
router.get("/static/:year/:division?", getAllMatches);

module.exports = router;
