const { default: axios } = require("axios");

const apiKey = process.env.ROBOTEVENTS_API_KEY;

// The RobotEvents API moved from www.robotevents.com to events.vex.com
const ROBOTEVENTS_BASE = process.env.ROBOTEVENTS_BASE_URL || "https://events.vex.com/api/v2";

const requestRobotEvents = async (url, params = {}) => {
    return await axios.get(
        url,
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            params: params
        }
    );
}

module.exports = { requestRobotEvents, ROBOTEVENTS_BASE }