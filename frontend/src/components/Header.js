import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Accordion, Button, FloatingLabel, Form, Nav, NavDropdown, OverlayTrigger, Popover} from "react-bootstrap";
import logo from '../resources/logo.png';
import theme from "../common/Theme";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import Modal from 'react-bootstrap/Modal';
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';


export default function Header({user}) {
    let navigate = useNavigate();
    const form = useRef();
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [rating, setRating] = useState("");
    const [validated, setValidated] = useState(false);


    function logout() {
        AuthService.logout()
        navigate("/");
        window.location.reload();
    }


    const nav = user ? (<Nav>
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
                <Popover>
                    <Popover.Header as="h3">{`Log Out`}</Popover.Header>
                    <Popover.Body>
                        Are you going to <strong className="d-inline-block border-danger border border-2 p-1 rounded-2">log
                        out</strong> ?
                        <Button className="alert-danger bt-sm mt-1 " variant="danger" onClick={logout}>
                            Log Out
                        </Button>
                    </Popover.Body>
                </Popover>
            }
        >

            <Button
                variant="light"
                className="d-inline-flex align-items-center btn-sm me-2"
            >
                <PersonRoundedIcon/>
                <span className="ms-1 fw-bold fs-5">{user}</span>
            </Button>

        </OverlayTrigger>
    </Nav>) : (<Nav>
        <Nav.Link href="/login">
            Log in
        </Nav.Link>
        <Nav.Link href="/register">
            Register
        </Nav.Link>
    </Nav>);

    const handleClose = () => {
        setShow(false);
        setValidated(false)
    };
    const handleShow = () => setShow(true);

    function handleSearch() {
        if(vrating(rating)){
            return;
        }

        navigate('/searchResult?title='+encodeURIComponent(title) +'&artist='+encodeURIComponent(artist)+'&genre='+encodeURIComponent(genre)+'&rating='+encodeURIComponent(rating))
        window.location.reload();
    }

    const vrating = (value) =>{
        const regExp = /^[1-5]$/;
        console.log(value)
        return value!=="" && !regExp.test(value);

    };
    return (
        <>

            <Navbar expand="md" style={{backgroundColor: theme.dark}} variant="dark">

                <Container className="col-12" style={{maxWidth: "none"}}>

                    <Navbar.Brand style={{overflow: "hidden"}}>

                        <img src={logo} alt="fatEar " width="60" className="d-inline-block align-top" style={{
                            marginLeft: 30,
                            position: "relative",
                            left: "-10px",
                            transform: "scale(2.2)"
                        }}/>

                    </Navbar.Brand>

                    <NavbarToggle aria-controls="responsive-navbar-nav"
                                  style={{backgroundColor: theme.peach}}></NavbarToggle>
                    <NavbarCollapse id="responsive-navbar-nav">
                        <Nav className="d-flex m-auto col-4 justify-content-center">

                            <Button variant="light" onClick={handleShow} className="w-50" style={{minWidth: 150}}>
                                <SearchIcon/>
                                Search
                            </Button>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Search Songs</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="d-flex flex-column">
                                    <Form noValidate validated={validated} ref={form}>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control type="text"  placeholder="Enter the title of song"
                                                          onChange={e => setTitle(e.target.value)}
                                                          defaultValue={title}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Artist</Form.Label>
                                            <Form.Control type="text"  placeholder="Enter the name of artist"
                                                          onChange={e => setArtist(e.target.value)}
                                            defaultValue={artist}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Genre</Form.Label>
                                            <Form.Control type="text" placeholder="Enter the genre"
                                                          onChange={e => setGenre(e.target.value)}
                                            defaultValue={genre}/>

                                        </Form.Group>


                                        <Form.Group className="mb-3">
                                            <Form.Label>Rating</Form.Label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="basic-addon3">
                                                    >
                                                </InputGroup.Text>
                                                <Form.Control type="text"
                                                              placeholder="Enter the threshold for the minimum rating"
                                                              aria-describedby="basic-addon3"
                                                              onChange={e => setRating(e.target.value)}
                                                              isInvalid={ vrating(rating)}
                                                defaultValue={rating}/>
                                                <Form.Control.Feedback type="invalid">
                                                    Input should be an integer between 1-5
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>


                                    </Form></Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit" onClick={handleSearch} disabled={vrating(rating)}>
                                        Search
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                        </Nav>

                        {nav}

                    </NavbarCollapse>


                </Container>
            </Navbar>


        </>
    );
};