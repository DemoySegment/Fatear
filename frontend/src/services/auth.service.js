import axios from "axios";
import API_URL from "./backendConfig";



const register = (userName,
                  password,
                  firstName,
                  lastName,
                  nickName) => {
    return axios.post(API_URL + "signup", {
        userName,
        password,
        firstName,
        lastName,
        nickName
    });
};

const login = (userName, password) => {
    return axios
        .post(API_URL + "login", {
            userName,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");

};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
