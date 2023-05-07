import axios from "axios";
import API_URL from "./backendConfig";
import authHeader from "./auth-header";

import authService from "./auth.service";

const user = authService.getCurrentUser()
const searchUser = (input) => {
    return axios.post(API_URL + "follow/search", {follows: user.username, follower: input}, {headers: authHeader()})
};
const getFollower = () => {
    return axios.post(API_URL + "follow/getFollower", {username: user.username}, {headers: authHeader()})
};

const newFollowRequest = (username) => {
    return axios.post(API_URL + "follow/newFollow", {follows: user.username, follower: username}, {headers: authHeader()})
};


const
    followPageService = {
        searchUser,
        getFollower,
        newFollowRequest



    };

export default followPageService;