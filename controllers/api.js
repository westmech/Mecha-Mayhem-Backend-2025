const { yearToKeyMap, divToKeyMap } = require("../util/maps");

// route to get event information for a season
const getEventInfo = async (req, res) => {
    const year = req.params.year;
    const div = req.params.division;

    try {
        const yearkey = yearToKeyMap[year];
        const divKey = divToKeyMap[div];
        
        res.json({
            yearKey : yearkey,
            divKey : divKey
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Event Not Found" });
    }
}

module.exports = { getEventInfo };