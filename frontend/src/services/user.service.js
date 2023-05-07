import axios from "axios";
import authHeader from "./auth-header";
import API_URL from "./backendConfig";


const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const UserService = {
  getUserBoard
};

export default UserService;
