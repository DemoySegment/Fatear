import axios from "axios";
import API_URL from "./backendConfig";
import authHeader from "./auth-header";

const searchSongs = (title, artist, genre, rating) => {
    return axios.post(API_URL + "search/searchSongs", {title: title, artist: artist, genre: genre, rating:rating})
};



const
    searchResultPageService = {
        searchSongs,



    };

export default searchResultPageService;