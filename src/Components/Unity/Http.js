const axios = require("axios");

async function get(url, options) {
    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (err) {
        throw console.log(err);
    }
}

async function post(url, body, options) {
    try {
        const response = await axios.post(url, body, options);
        return response.data;
    } catch (err) {
        throw console.log(err);
    }
}

async function put(url, body, options) {
    try {
        const response = await axios.put(url, body, options);
        return response.data;
    } catch (err) {
        throw console.log(err);
    }
}

module.exports.get = get;
module.exports.post = post;
module.exports.put = put;