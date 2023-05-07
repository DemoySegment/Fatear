import axios from "axios";
import API_URL from "./backendConfig";
import authHeader from "./auth-header";

import authService from "./auth.service";

const user = authService.getCurrentUser()

const getSongDetail = (songID) => {
    return axios.get(API_URL + "song/" + songID )
};
const getMyReview = (songID) => {
    return axios.post(API_URL + "song/getMyReview", {username: user.username, song_id: songID}, {headers: authHeader()})
};

const getMyRating = (songID) => {
    return axios.post(API_URL + "song/getMyRating", {username: user.username, song_id: songID}, {headers: authHeader()})
};

const postSongRate = (songID, rate) => {
    return axios.post(API_URL + "song/postSongRate", {username: user.username, song_id: songID, star: rate}, {headers: authHeader()})
};

const postSongReview = (songID, review) => {
    return axios.post(API_URL + "song/postSongReview", {username: user.username, song_id: songID, content: review}, {headers: authHeader()})
};

const
    songService = {
        getSongDetail,

        getMyReview,
        getMyRating,

        postSongReview,
        postSongRate,
    };

export default songService;