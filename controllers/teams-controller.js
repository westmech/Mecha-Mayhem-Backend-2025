const { transformMatches } = require("../util/transformers/transformMatches");
const { yearToKeyMap, gradeToKeyMap } = require("../util/maps");
const { getAllTeamsData, getTeamInfo } = require("../util/req/getTeamInfo");
const { requestRobotEvents, ROBOTEVENTS_BASE } = require("../util/req/requestRobotEvents");

// route to retrieve team information for a season
const getInfo = async (req, res) => {
    const teamNumber = req.params.teamNumber;
    const grade = req.params.grade;
    const year = req.params.year;

    // construct the URL based on the team number, grade, and year
    try {
        const response = await requestRobotEvents(
            `${ROBOTEVENTS_BASE}/teams?number%5B%5D=${teamNumber}${gradeToKeyMap[grade]}`
        );

        const data = response.data.data[0];

        if (data !== undefined) {
            const team_id = data.id;
            const team_name = data.team_name;

            const matchRes = await requestRobotEvents(
                `${ROBOTEVENTS_BASE}/teams/${team_id}/matches?event%5B%5D=${yearToKeyMap[year]}`
            );
            const matchData = matchRes.data.data[0];
            if (matchData !== undefined) {
                const team_div = matchData.division.name.toLowerCase();
                const matches = matchRes.data.data;
                const transformedMatches = await transformMatches(
                    matches,
                    year,
                    team_div
                );

                const rankingRes = await requestRobotEvents(
                    `${ROBOTEVENTS_BASE}/teams/${team_id}/rankings?event%5B%5D=${yearToKeyMap[year]}`
                );
                const rankData = rankingRes.data.data[0]

                const rank = rankData.rank;
                const wins = rankData.wins;
                const losses = rankData.losses;
                const ties = rankData.ties;
                const wp = rankData.wp;
                const ap = rankData.ap;
                const sp = rankData.sp;
                const high = rankData.high_score;
                const avg = rankData.average_points;
                const total = rankData.total_points;

                res.json({
                    team_number: teamNumber,
                    team_name: team_name,
                    matches: transformedMatches,
                    rank: rank,
                    wins: wins,
                    losses: losses,
                    ties: ties,
                    wp: wp,
                    ap: ap,
                    sp: sp,
                    high: high,
                    avg: avg,
                    total: total,
                });
            } else {
                res.status(404).json({ error: `No team data for ${year}` });
            }
        } else {
            res.status(404).json({ error: "Team not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// route to retrieve team information for a season
const getAllTeams = async (req, res) => {
    const year = req.params.year;

    try {
        res.json(await getAllTeamsData(year));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// route to retrieve team information for a season
const getOneTeam = async (req, res) => {
    const number = String(req.params.number);
    const year = String(req.params.year);

    try {
        res.json(await getTeamInfo(number, year));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// retrieve a teams OPR for a season
const getOPR = async (req, res) => {
    res.status(501).json({ error: "OPR is not implemented" });
};

module.exports = { getInfo, getAllTeams, getOneTeam, getOPR };
