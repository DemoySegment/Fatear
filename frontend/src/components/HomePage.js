import {useEffect, useState} from "react";
import homePageService from "../services/homePageService";
import AuthService from "../services/auth.service";
import Container from "react-bootstrap/Container";
import {Toast, ToastContainer} from "react-bootstrap";
import SongBox from "./SongBox";
import * as React from "react";
import ErrorSnackbars from "./ErrorSnackbar";

export default function HomePage() {
    const [songs, setSongs] = useState(undefined)
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");



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


    useEffect(() => {
        homePageService.getNewSongs().then(response => {
            console.log(response.data.result);
            setSongs(response.data.result);
        })
            .catch(e => {
                showError(e.message);
            });



    }, []);

    return (
        <>
            <Container>
                <ErrorSnackbars handleClose={e=>handleClose(e,'')} message={message} open={open}></ErrorSnackbars>

                <h1>New songs</h1>
                <Container className="justify-content-around  d-flex flex-wrap gap-1" >
                    {songs && songs.map(song=>{
                        return(<SongBox song={song} key={song.songID}></SongBox>)
                    })}
                </Container>

            </Container>
        </>
    )
}