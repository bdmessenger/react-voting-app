import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8080/';

export default axios.create({
    baseURL: BASE_URL,
    timeout: 1500,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
    }
});