const express = require("express");
const { getEventInfo } = require("../controllers/api");
const router = express.Router();

// route to retrieve team information for a season
router.get("/event/id/:year/:division", getEventInfo);

module.exports = router;