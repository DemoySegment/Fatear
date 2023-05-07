import React, {useEffect, useState} from "react";

import AuthService from "../services/auth.service";
import Container from "react-bootstrap/Container";
import {Button, Card, Toast, ToastContainer} from "react-bootstrap";
import SongBox from "./SongBox";
import newsPageService from "../services/newsPageService";
import {Alert, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import {useNavigate} from "react-router-dom";
import ErrorSnackbars from "./ErrorSnackbar";

export default function NewsPage() {
    const [songs, setSongs] = useState([])
    const [friendReviews, setFriendReviews] = useState([]);
    const [followerReviews, setFollowerReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        newsPageService.getSubscribedSongs().then(response => {
            console.log(response.data.result)
            setSongs(response.data.result)
        }).catch(e => {
            console.log(e)
            showError(e.message);
        });
        newsPageService.getFriendReview().then(response => {
            console.log(response.data.result)
            setFriendReviews(response.data.result)
        }).catch(e => {
            console.log(e)
            showError(e.message);
        });
        newsPageService.getFollowerReview().then(response => {
            setFollowerReviews(response.data.result)
            console.log(response.data.result)
        }).catch(e => {
            console.log(e)
            showError(e.message);
        });


    }, []);

    let navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const showError = (message)=>{
        setMessage(message);
        setOpen(true);
    }
    function handleClick(songID) {
        navigate("/song?songID="+songID);
    }

    return (
        <>
            <Container>
                <h1>New Songs from Subscribed Artists</h1>
                <ErrorSnackbars handleClose={e=>handleClose(e,'')} message={message} open={open}></ErrorSnackbars>
                <Card border="light" className="rounded-3">
                    <Card.Header as="h5">Songs</Card.Header>
                    <Card.Body className="overflow-auto" style={{minHeight: 80, maxHeight: 500}}>
                        {songs.length > 0 ?
                            <Container className="justify-content-around  d-flex flex-wrap gap-1">
                                {songs && songs.map(song => {
                                    return (<SongBox song={song} key={song.songID}></SongBox>)
                                })}
                            </Container>:
                            <Alert className="w-25" variant="outlined" severity="info" color="info">Nothing new </Alert>

                        }

                    </Card.Body>
                </Card>

            </Container>

            <Container>
                <h1>New Reviews from Friends</h1>

                <Card border="light" className="rounded-3">
                    <Card.Header as="h5">Reviews</Card.Header>
                    <Card.Body className="overflow-auto" style={{minHeight: 80, maxHeight: 500}}>
                        {friendReviews.length > 0 ?
                            <List
                                sx={{bgcolor: 'background.paper'}}
                                aria-label="contacts"
                            >
                                {friendReviews.map((review, index) => {
                                        return (
                                            <div key={review.id}>
                                                <ListItem>
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <SentimentVerySatisfiedIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <Container className="d-flex flex-column">
                                                            <ListItemText className="flex-grow-1" primary={review.username}
                                                                          secondary={review.reviewDate}/>
                                                            <p className="d-flex flex-grow-2"> {review.reviewText}</p>

                                                        </Container>
                                                        <Container className="d-flex justify-content-center">
                                                            <Button className=" w-50" variant="outline-danger" onClick={e=>{handleClick(review.songID)}}>  {review.title}</Button>
                                                        </Container>

                                                    </ListItemButton>

                                                </ListItem>
                                                <Divider variant="inset" component="li"/>
                                            </div>

                                        )
                                    }
                                )}


                            </List> :
                            <Alert className="w-25" variant="outlined" severity="info" color="info">Nothing new </Alert>


                        }
                    </Card.Body>
                </Card>

            </Container>

            <Container>
                <h1>New Reviews from Followers</h1>

                <Card border="light" className="rounded-3">
                    <Card.Header as="h5">Reviews</Card.Header>
                    <Card.Body className="overflow-auto" style={{minHeight: 80, maxHeight: 500}}>
                        {followerReviews.length > 0 ?
                            <List
                                sx={{bgcolor: 'background.paper'}}
                                aria-label="contacts"
                            >
                                {followerReviews.map((review, index) => {
                                        return (
                                            <div key={review.id}>
                                                <ListItem>
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <SentimentVerySatisfiedIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <Container className="d-flex flex-column">
                                                            <ListItemText className="flex-grow-1" primary={review.username}
                                                                          secondary={review.reviewDate}/>
                                                            <p className="d-flex flex-grow-2"> {review.reviewText}</p>

                                                        </Container>
                                                        <Container className="d-flex justify-content-center">
                                                            <Button className=" w-50" variant="outline-danger" onClick={e=>{handleClick(review.songID)}}>  {review.title}</Button>
                                                        </Container>

                                                    </ListItemButton>

                                                </ListItem>
                                                <Divider variant="inset" component="li"/>
                                            </div>

                                        )
                                    }
                                )}


                            </List> :
                            <Alert className="w-25" variant="outlined" severity="info" color="info">Nothing new </Alert>


                        }
                    </Card.Body>
                </Card>

            </Container>
        </>
    )
}