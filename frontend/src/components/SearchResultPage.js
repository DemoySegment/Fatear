import React, {useEffect, useState} from "react";
import homePageService from "../services/homePageService";
import AuthService from "../services/auth.service";
import Container from "react-bootstrap/Container";
import {Toast, ToastContainer, Button, Badge} from "react-bootstrap";
import SongBox from "./SongBox";
import searchResultPageService from "../services/searchResultPageService";
import {useLocation} from "react-router";
import {Alert} from "@mui/material";
import ErrorSnackbars from "./ErrorSnackbar";

export default function SearchResultPage() {
    const [title, setTitle] = useState("");
    const [songs, setSongs] = useState([])
    const [artist, setArtist] = useState("")
    const [genre, setGenre] = useState("")
    const [rating, setRating] = useState("")
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const {search} = useLocation();
    const params = new URLSearchParams(search);


    useEffect(() => {
        setTitle(params.get("title"))
        setArtist(params.get("artist"))
        setGenre(params.get("genre"))
        setRating(params.get("rating"))
        console.log([params.get("title"),params.get("artist"), params.get("genre"), params.get("rating")])


        searchResultPageService.searchSongs(params.get("title"), params.get("artist"), params.get("genre"), params.get("rating")).then(response => {
            console.log(response.data.result)
            setSongs(response.data.result)
        })
            .catch(e => {
                console.log(e)
                showError(e.message);
            });


    }, []);

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

    return (
        <>
            <Container>
                <ErrorSnackbars handleClose={e=>handleClose(e,'')} message={message} open={open}></ErrorSnackbars>
                <h1>Search Result</h1>
                {title.length > 0 && <h4 className="d-inline-block me-2 ms-2"><Badge bg="secondary">Title: {title}</Badge></h4>}
                {artist.length > 0 && <h4 className="d-inline-block me-2 ms-2"><Badge bg="secondary">Artist: {artist}</Badge></h4>}
                {genre.length > 0 && <h4 className="d-inline-block me-2 ms-2"><Badge bg="secondary">Genre: {genre}</Badge></h4>}
                {rating.length > 0 && <h4 className="d-inline-block me-2 ms-2"><Badge bg="secondary">Rating: > {rating}</Badge></h4>}
                <h4 className=" me-2 ms-4">Total {songs.length} results</h4>
                {
                    songs.length > 0 ? <Container className="justify-content-around  d-flex flex-wrap gap-1">
                            {songs && songs.map(song => {
                                return (<SongBox song={song} key={song.songID}></SongBox>)
                            })}
                        </Container> :
                        <Alert className="w-25" variant="outlined" severity="info" color="info">Nothing to show </Alert>
                }


            </Container>
        </>
    )
}