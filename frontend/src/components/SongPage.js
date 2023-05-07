import {useLocation} from "react-router";
import songService from "../services/songService";
import React, {useEffect, useRef, useState} from "react";
import followPageService from "../services/followPageService";
import {Button, Card, FloatingLabel, InputGroup, ListGroup, Toast, ToastContainer} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import {Alert, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import * as friends from "react-bootstrap/ElementChildren";
import AuthService from "../services/auth.service";
import ErrorSnackbars from "./ErrorSnackbar";

export default function SongPage() {
    const {search} = useLocation();

    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);

    const [rate, setRate] = useState(1);
    const [rated, setRated] = useState(false);
    const [review, setReview] = useState("");
    const [reviewed, setReviewed] = useState(false);

    const form = useRef();
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [avgRate, setAvgRate] = useState(0);
    const [needUpdateReview, setNeedUpdateReview] = useState(false);
    const [needUpdateRating, setNeedUpdateRating] = useState(false);
    const [song, setSong] = useState()

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const params = new URLSearchParams(search);
    const songID = params.get('songID');
    const showReviews = song && song.reviews.length > 0;
    const showArtist = song && song.artist_list.length > 0;
    const showURL = song && song.songURL;
    const showGenre = song && song.genre_list.length > 0;


    useEffect(() => {
        const user = AuthService.getCurrentUser();

        setCurrentUser(user);
        songService.getSongDetail(songID).then(response => {
            console.log(response.data.result[0]);
            setSong(response.data.result[0])
            setAvgRate(response.data.result[0].avg_rating[0].avg)

        }).catch(e => {
            console.log(e);
            showError(e.message);
        })
        if (user) {
            songService.getMyRating(songID).then(response => {
                console.log(response.data.result)
                if (response.data.result.length > 0) {
                    setRate(response.data.result[0].stars)
                    setRated(true)
                }


            })
            songService.getMyReview(songID).then(response => {
                console.log(response.data.result)
                if (response.data.result.length > 0) {
                    setReview(response.data.result[0].reviewText)
                    setReviewed(true)
                }
            }).catch(e => {
                console.log(e);
                showError(e.message);
            })
        }


    }, [needUpdateReview, needUpdateRating]);

    const toggleShowA = (state) => setShowA(state);

    const toggleShowB = (state) => setShowB(state);

    function handleRating(val) {
        console.log(Math.round(val / 100 * 4 + 1))
        setRate(Math.round(val / 100 * 4 + 1))
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const showError = (message) => {
        setMessage(message);
        setOpen(true);
    }


    function submitRating() {
        setLoading(true);
        songService.postSongRate(songID, rate).then(response => {
            setNeedUpdateRating(!needUpdateRating)
            toggleShowA(true)

        }).catch(e => {
            console.log(e);
            showError(e.message);
        })
        setLoading(false);
    }

    const submitReview = (e) => {
        e.preventDefault();
        setLoading(true);
        if (form.current.checkValidity() === false) {
            e.stopPropagation();
            setLoading(false);
            setValidated(true)
            return
        }
        songService.postSongReview(songID, review).then(response => {
            setNeedUpdateReview(!needUpdateReview)
            toggleShowB(true)

        }).catch(e => {
            console.log(e);
            showError(e.message);
        })
        setLoading(false);
    }


    return (
        <>
            <ErrorSnackbars handleClose={e => handleClose(e, '')} message={message} open={open}></ErrorSnackbars>
            <Container className="d-flex justify-content-start flex-wrap">

                <Container style={{width: '500px', minWidth: '350px'}}
                           className="d-flex flex-wrap  w-50  justify-content-end  mb-3"
                >

                    <Card style={{width: '500px', minHeight: '200px', minWidth: '350px', height: '300px'}}
                          className=" d-flex btn-outline-danger justify-content-center rounded-4 mt-0"
                          as={Button}>
                        <Card.Body className="d-flex m-auto flex-wrap">
                            <Card.Title
                                className="d-flex fs-2 text-start  align-items-center">{song && song.title}</Card.Title>
                        </Card.Body>
                    </Card>


                    <Card className=" mb-0 rounded-4 mt-3" border="light" bg="white" style={{minWidth: '300px'}}>
                        <Card.Body>
                            {showURL ? song.songURL : "Unknown"}
                        </Card.Body>
                    </Card>

                </Container>

                <Container className="d-flex flex-wrap flex-column w-50  justify-content-evenly align-content-center">
                    <Card className=" mt-0 rounded-4 mb-0" border="light" bg="white" style={{minWidth: '300px'}}>
                        <Card.Body>
                            <ListGroup as="ol" variant="flush">
                                <ListGroup.Item as="li"
                                                className="h5">Artist: {showArtist ? song.artist_list.join(",") : "Unknown"}</ListGroup.Item>
                                <ListGroup.Item as="li"
                                                className="h5">Genre: {showGenre ? song.genre_list.join(",") : "Unknown"}</ListGroup.Item>
                                <ListGroup.Item as="li" className="h5">Release
                                    Date: {song && song.releaseDate}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Container className="d-flex  justify-content-center">
                        <Card className="  rounded-4 mb-0" border="light" bg="white" style={{minWidth: '300px'}}>
                            <Card.Body>
                                Avg Rating: <strong>{avgRate}</strong>
                                <Form.Range value={Math.round(avgRate * 20).toString()} readOnly={true}/>
                            </Card.Body>
                        </Card>
                    </Container>
                </Container>

            </Container>

            {currentUser &&
                <Card border="light" className="rounded-3 mt-2">
                    <ToastContainer className="p-3" position="top-end">
                        <Toast show={showA} onClose={() => toggleShowA(false)} className="" delay={3000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">New Rating</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>Rating submit!</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    <Card.Header as="h5">Your Rating</Card.Header>
                    <Card.Body className="overflow-auto" style={{minHeight: 80, maxHeight: 500}}>
                        {rated && <Form.Text muted className="d-inline-block">
                            You have already rated. Your rating is listed below.
                        </Form.Text>}
                        <p>Your Rating: <strong>{rate}</strong></p>

                        <Form.Range value={(rate - 1) * 100 / 4} onChange={(e) => handleRating(e.target.value)}
                                    disabled={rated}/>
                        <Button disabled={rated} onClick={submitRating}> {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : "Submit"} </Button>


                    </Card.Body>
                </Card>
            }

            {currentUser &&
                <Card border="light" className="rounded-3 mt-2">
                    <ToastContainer className="p-3" position="top-end">
                        <Toast show={showB} onClose={() => toggleShowB(false)} className="" delay={3000} autohide
                               bg="success">
                            <Toast.Header>
                                <strong className="me-auto">Post new Review</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>Review Posted!</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    <Card.Header as="h5">Your Review</Card.Header>
                    <Card.Body className="overflow-auto" style={{minHeight: 80, maxHeight: 500}}>

                        <Form onSubmit={submitReview} noValidate validated={validated} ref={form}>
                            {reviewed && <Form.Text muted>
                                You have already reviewed. Your review is listed below.
                            </Form.Text>}
                            <InputGroup hasValidation>

                                <Form.Control
                                    type="text"
                                    placeholder={review}
                                    disabled={reviewed}
                                    required
                                    onChange={e => setReview(e.target.value)}
                                    as="textarea"

                                />

                                <Form.Control.Feedback type="invalid">
                                    Please input some content.
                                </Form.Control.Feedback>
                            </InputGroup>

                            <Button disabled={reviewed} type="submit" className="mt-2"> {loading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : "Submit"} </Button>
                        </Form>


                    </Card.Body>
                </Card>
            }


            <Card border="light" className="rounded-3">
                <Card.Header as="h5">Reviews</Card.Header>
                <Card.Body className="overflow-auto" style={{minHeight: 80, maxHeight: 500}}>
                    {showReviews ? <List
                            sx={{bgcolor: 'background.paper'}}
                            aria-label="contacts"
                        >
                            {song.reviews.map((review, index) => {
                                    return (
                                        <div key={review.username}>
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <SentimentVerySatisfiedIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <Container className="d-flex">
                                                        <ListItemText primary={review.username} secondary={review.reviewDate}/>
                                                        <p> {review.reviewText}</p>
                                                    </Container>

                                                </ListItemButton>

                                            </ListItem>
                                            <Divider variant="inset" component="li"/>
                                        </div>

                                    )
                                }
                            )}


                        </List> :
                        <Alert className="w-25" variant="outlined" severity="info" color="info">No reviews yet. </Alert>
                    }

                </Card.Body>
            </Card>


        </>
    )
}