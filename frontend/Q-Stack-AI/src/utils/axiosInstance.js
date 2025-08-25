import axios from "axios";

import { BASE_URL } from "./apiPaths";

//What is an Axios Instance?
// An Axios instance is a custom version of Axios with pre-configured settings (like base URL, headers, timeout).
// You create it using axios.create({ ... }).
// This lets you reuse the same config for all your API calls.

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//What are Interceptors?
// Interceptors are functions that run before a request is sent or after a response is received.
// They let you modify requests/responses globally (e.g., add tokens, handle errors).

//Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response){
            if(error.response.status === 401) {
            window.location.href = "/";
            }else if(error.response.status === 500) {
                console.log("Server Error....Please Try again later");
                
            }
        }else if(error.code = "ECONNABORTED") {
            console.log("Network Error....Please Try again later");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;