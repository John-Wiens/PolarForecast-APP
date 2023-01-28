const API_KEY = "ar4AZMs0exe7RmAAgh4N5jMc2fm96UaE5gZftbP7Yi12SMPgoxX4gtvAVZ3CDBK9";
const url = "http://172.27.212.77:8081/2022/code/stats";
const API_ENDPOINT = "http://172.27.212.77:8081";




export const getStatDescription = async (year, event, callback) => {
    try {
        const endpoint = `${API_ENDPOINT}/${year}/${event}/stat_description`;
        console.log("Requesting Data from: " + endpoint);
        const response = await fetch(endpoint);
        const data = await response.json()
        callback(data);
    } catch (error) {
        console.error(error);
    }
}

export const getRankings = async (year, event, callback) => {
    try {
        const endpoint = `${API_ENDPOINT}/${year}/${event}/stats`;
        console.log("Requesting Data from: " + endpoint);
        const response = await fetch(endpoint);
        const data = await response.json()
        callback(data);
    } catch (error) {
        console.error(error);
    }
}

export const getSearchKeys = async (callback) => {
    try {
        const endpoint = `${API_ENDPOINT}/search_keys`;
        console.log("Requesting Data from: " + endpoint);
        const response = await fetch(endpoint);
        const data = await response.json()
        callback(data);
    } catch (error) {
        console.error(error);
    }
}
