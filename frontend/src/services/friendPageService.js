import axios from "axios";
import API_URL from "./backendConfig";
import authHeader from "./auth-header";

import authService from "./auth.service";

const user = authService.getCurrentUser()
const searchUser = (input) => {
    return axios.post(API_URL + "friend/search", {user1: user.username, user2: input}, {headers: authHeader()})
};
const getFriends = () => {
    return axios.post(API_URL + "friend/getFriends", {username: user.username}, {headers: authHeader()})
};
const getRequestsTo = () => {
    return axios.post(API_URL + "friend/getRequestsTo", {username: user.username}, {headers: authHeader()})
};

const getRequestsBy = () => {
    return axios.post(API_URL + "friend/getRequestsBy", {username: user.username}, {headers: authHeader()})
};
const newFriendRequest = (username) => {
    return axios.post(API_URL + "friend/friendRequest", {user1: user.username, user2: username}, {headers: authHeader()})
};

const rejectFriendRequest = (username) => {
    return axios.post(API_URL + "friend/rejectFriendRequest", {user1: username, user2:  user.username}, {headers: authHeader()})
};

const acceptFriendRequest = (username) => {
    return axios.post(API_URL + "friend/acceptFriendRequest", {user1: username, user2:  user.username}, {headers: authHeader()})
};
const
    friendPageService = {
        searchUser,
        getFriends,
        getRequestsTo,
        getRequestsBy,
        newFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest


    };

export default friendPageService;