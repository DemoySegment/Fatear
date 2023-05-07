import logo from './resources/logo.svg';
import './App.css';
import Header from './components/Header'
import Sidebar from "./components/Sider";
import AuthService from "./services/auth.service";
import homePageService from "./services/homePageService";
import {useEffect, useState} from "react";
import EventBus from "./common/EventBus";
import {Routes, Route, Link} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Container from "react-bootstrap/Container";
import HomePage from "./components/HomePage";
import FriendPage from "./components/FriendPage";
import FollowPage from "./components/FollowPage";
import SongPage from "./components/SongPage";
import NewsPage from "./components/NewsPage";
import SearchResultPage from "./components/SearchResultPage";



function App() {
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect(() => {

        const user = AuthService.getCurrentUser() ;

        setCurrentUser(user);


    }, []);
    const songId = "1"

    const className = currentUser ?"container-fluid flex-column d-flex": "container-fluid flex-column d-flex sb-sidenav-toggled"
    return (
        <>
            <div className={className}  style={{padding:0, height: "100vh"}}>
                <Header user={currentUser? currentUser.nickname : undefined}></Header>

                <div id="wrapper" className="d-flex flex-grow-1 ">
                    <Sidebar></Sidebar>
                    <div className="App flex-grow-1 p-4" id="page-content-wrapper" >
                        <div className="container mt-3">
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/news" element={<NewsPage/>}/>
                                <Route path="/song" element={<SongPage />} />
                                <Route path="/follow" element={<FollowPage/>}/>
                                <Route path="/friend" element={<FriendPage/>}/>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/register" element={<Register/>}/>
                                <Route path="/searchResult" element={<SearchResultPage/>}/>

                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
