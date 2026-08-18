// awards: raw award objects from the RobotEvents API for a single event
// roster: { [teamNumber]: { number, name, affiliation, location } } for that same event
// division: "HS" | "MS" | null (null for blended events before 2025)
function transformAwards(awards, roster, division) {
    return awards.flatMap((award) =>
        award.teamWinners.map((teamWinner) => {
            const teamNumber = teamWinner.team.name;
            const teamInfo = roster[teamNumber] ?? {
                number: teamNumber,
                name: "",
                affiliation: "",
                location: "",
            };

            return {
                award: award.title.replace(/\s*\(.*?\)/, ""),
                division: division,
                team: teamInfo.number,
                name: teamInfo.name,
                affiliation: teamInfo.affiliation,
                location: teamInfo.location,
            };
        })
    );
}

module.exports = { transformAwards }
