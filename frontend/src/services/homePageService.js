import axios from "axios";
import API_URL from "./backendConfig";

const getNewSongs = () => {
    return axios.post(API_URL + "getNewSongs")

};


const homePageService = {
    getNewSongs,

};

export default homePageService;