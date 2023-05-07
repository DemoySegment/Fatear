import axios from "axios";
import API_URL from "./backendConfig";
import authHeader from "./auth-header";

import authService from "./auth.service";

const user = authService.getCurrentUser()


const getSubscribedSongs = () => {
    return axios.post(API_URL + "news/getSubscribedSongs", {username: user.username, start_time: user.lastlogin}, {headers: authHeader()})
};

const getFriendReview = () => {
    return axios.post(API_URL + "news/getFriendReview", {username: user.username, start_time: user.lastlogin}, {headers: authHeader()})
};

const getFollowerReview = () => {
    return axios.post(API_URL + "news/getFollowerReview", {username: user.username, start_time: user.lastlogin}, {headers: authHeader()})
};


const
    newsPageService = {

        getSubscribedSongs,
        getFriendReview,
        getFollowerReview,

    };

export default newsPageService;