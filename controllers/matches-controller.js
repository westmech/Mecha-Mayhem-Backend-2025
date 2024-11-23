const { transformMatches } = require("../util/transformers/transformMatches");
const { yearToKeyMap, divToKeyMap } = require("../util/maps");
const { paginationHelper } = require("../util/req/concPagination")
const { requestRobotEvents } = require("../util/req/requestRobotEvents")
const { removeDuplicates } = require("../util/transformers/removeDuplicates");

const streamAllMatches = async (req, res) => {
    const year = req.params.year;
    const div = req.params.division;
    
    // set next page to be current for now
    const currentPage = req.body.currentPage;
    let nextPage = req.body.currentPage;

    // set next round index to be current for now
    const currentRoundIndex = req.body.currentRoundIndex;
    let nextRoundIndex = req.body.currentRoundIndex;
    let matchLog = null;

    // An adjustment to the weird numbering system within RobotEvents
    const orderOfIteration = [1, 2, 6, 3, 4, 5];

    // current round
    const curRound = orderOfIteration[currentRoundIndex];

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // params related to pagination
    const params = {   
        page: currentPage,
        per_page: 10,
    };

    // api endpoint
    const url = `https://www.robotevents.com/api/v2/events/${yearToKeyMap[year]}/divisions/${divToKeyMap[div]}/matches?round%5B%5D=${curRound}`;

    try {
        // Getting streams
        const {resMeta, resData: matches} = await paginationHelper(url, params);

        console.log(resMeta);

        // Not at last page of current round, so nextPage is currentPage + 1
        if (resMeta.current_page < resMeta.last_page) {
            nextPage++;
        } else {
            // If we are done with current round, go to next round
            nextRoundIndex++;
            
            // checking if we have finished all the round
            if (nextRoundIndex == orderOfIteration.length) {
                // indicating we have finished retrieving the streams
                res.end();
            } 

            nextPage = 1;
        }


        let matchesArr = [];
        if (matches !== undefined && matches !== null) {
            for (const match of matches) {
                if (match !== undefined && match !== null) {
                    const transformedMatch = await transformMatches(
                        [match],
                        year,
                        div
                    );
    
                    if (transformedMatch[0]) {
                        matchesArr.push(transformedMatch[0]);
                        await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate real-time streaming
                    }
                }
            }
        }

        res.json({
            data: matchesArr,
            nextPage: nextPage,
            nextRoundIndex: nextRoundIndex
        });

        // Close the connection when done
        res.end();
    } catch (error) {
        console.error("Error fetching matches", error);
        console.log("matchLog", matchLog);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};

// const streamAllMatches = async (req, res) => {
//     const year = req.params.year;
//     const div = req.params.division;
//     let matchLog = null;

//     // An adjustment to the weird numbering system within RobotEvents
//     const orderOfIteration = [1, 2, 6, 3, 4, 5];

//     // Set headers for SSE
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     try {
//         for (const nextRoundType of orderOfIteration) {
//             // Request from RobotEvents API
//             const matches = await concPagination(
//                 `https://www.robotevents.com/api/v2/events/${yearToKeyMap[year]}/divisions/${divToKeyMap[div]}/matches?round%5B%5D=${nextRoundType}`
//             );

//             if (matches !== undefined && matches !== null) {
//                 for (const match of matches) {
//                     if (match !== undefined && match !== null) {
//                         const transformedMatch = await transformMatches(
//                             [match],
//                             year,
//                             div
//                         );
        
//                         if (transformedMatch[0]) {
//                             res.write(
//                                 `data: ${JSON.stringify(transformedMatch[0])}\n\n`
//                             );
//                             await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate real-time streaming
//                         }
//                     }
//                 }
//             }
//         }

//         // Close the connection when done
//         res.end();
//     } catch (error) {
//         console.error("Error fetching matches", error);
//         console.log("matchLog", matchLog);
//         res.status(500).json({ error: "Failed to fetch matches" });
//     }
// };

const getAllMatches = async (req, res) => {
    const year = req.params.year;
    const div = req.params.division;

    // An adjustment to the weird numbering system within RobotEvents
    const orderOfIteration = [1, 2, 6, 3, 4, 5];

    // Array to hold all the matches
    let allMatches = [];

    try {
        for (const nextRoundType of orderOfIteration) {
            // Request from RobotEvents API
            const matches = await concPagination(
                `https://www.robotevents.com/api/v2/events/${yearToKeyMap[year]}/divisions/${divToKeyMap[div]}/matches?round%5B%5D=${nextRoundType}`
            );
            
            console.log(matches)

            if (matches !== undefined && matches !== null) {
                for (const match of matches) {
                    if (match !== undefined && match !== null) {
                        const transformedMatch = await transformMatches(
                            [match],
                            year,
                            div
                        );
        
                        if (transformedMatch[0]) {
                            allMatches.push(transformedMatch[0]);
                        }
                    }
                }
            }
        }

        // Send the accumulated matches as a single JSON response
        res.status(200).json(allMatches);
    } catch (error) {
        console.error("Error fetching matches", error);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};

module.exports = { streamAllMatches, getAllMatches };
