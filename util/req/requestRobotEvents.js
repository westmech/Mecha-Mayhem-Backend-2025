const { default: axios } = require("axios");

const apiKey = process.env.ROBOTEVENTS_API_KEY;

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

module.exports = { requestRobotEvents }