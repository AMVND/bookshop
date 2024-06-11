import axios from "axios";
const HTTP_AUTH = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json'
    },
})

export default HTTP_AUTH;