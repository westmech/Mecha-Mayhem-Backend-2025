const { removeDuplicates } = require("../transformers/removeDuplicates");
const { requestRobotEvents } = require("./requestRobotEvents");

// processes API responses and removes duplicates
async function paginationHelper(url, params) {
    try {
        if (url !== null) {
            const response = await requestRobotEvents(url, params);
            const resMeta = response.data.meta;
            let resData = response.data.data;

            // Filter out undefined values
            resData = resData.filter(
                (item) => item !== undefined
            );
            // Remove duplicates from concatenated data
            resData = removeDuplicates(resData);
            
            return {resMeta, resData};
        }
    } catch (error) {
        console.error("Error fetching info from API:", error);
    }
}

// recursively concatenates paginated API results and removes duplicates
async function concPagination(url) {
    try {
        if (url !== null) {
            const response = await requestRobotEvents(url);
            const resMeta = response.data.meta;
            const resData = response.data.data;

            // Recursive call to fetch and concatenate the rest of the pages
            let concatenatedData = resData.concat(
                await concPagination(resMeta.next_page_url)
            );
            // Filter out undefined values
            concatenatedData = concatenatedData.filter(
                (item) => item !== undefined
            );
            // Remove duplicates from concatenated data
            concatenatedData = removeDuplicates(concatenatedData);

            return concatenatedData;
        }
    } catch (error) {
        console.error("Error fetching info from API:", error);
    }
}

module.exports = { paginationHelper, concPagination };
