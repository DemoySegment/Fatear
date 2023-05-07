import React, {useEffect, useRef, useState} from "react";
import friendPageService from "../services/friendPageService";
import {Accordion, Button, Card, Form, InputGroup, ListGroup, Table, Toast, ToastContainer} from "react-bootstrap";
import {
    Alert,
    Avatar,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import ListItemButton from '@mui/material/ListItemButton';

import * as PropTypes from "prop-types";
import followPageService from "../services/followPageService";


CloseIcon.propTypes = {fontSize: PropTypes.string};
export default function FollowPage() {
    const [showA, setShowA] = useState(false);


    const [followers, setFollowers] = useState([]);
    const [needUpdateFollower, setNeedUpdateFollower] = useState(false);


    const [searchUser, setSearchUser] = useState("");
    const [searchResult, setSearchResult] = useState(undefined);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const showSearchResult = searchResult && searchResult.length !== 0

    const showFollowersTable = followers && followers.length !== 0;
    const form = useRef();


    useEffect(() => {
        followPageService.getFollower().then(response => {
            console.log(response.data.result)
            setFollowers(response.data.result)

        })
            .catch(error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.error &&
                        error.response.data.error.info) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            });

    }, [needUpdateFollower]);

    const toggleShowA = (state) => setShowA(state);


    const onChangeUsername = (e) => {
        const username = e.target.value;
        setSearchUser(username);
    };

    const handleSearch = (e) => {
        setSearchResult(undefined)
        e.preventDefault();
        setMessage("");
        setLoading(true);
        if (form.current.checkValidity() === false) {
            e.stopPropagation();
            setLoading(false);
            setValidated(true)
            return
        }
        followPageService.searchUser(searchUser).then(response => {
                console.log(response.data.result);
                setLoading(false);
                setSearchResult(response.data.result)
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.error &&
                        error.response.data.error.info) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            })
    };

    const handleNewRequest = (e, username, index) => {

        setSearchResult(undefined)
        e.preventDefault();
        setMessage("");
        setLoading(true);

        followPageService.newFollowRequest(username).then(response => {
                console.log(response.data.result);
                setLoading(false);
                let tem = searchResult.slice();
                tem.splice(index, 1);
                setSearchResult(tem);

                setNeedUpdateFollower(!needUpdateFollower)

                toggleShowA(true)

            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.error &&
                        error.response.data.error.info) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            })
    }


    return (
        <>
            <h1> Follow</h1>
            <Card border="light" className="rounded-3">
                <ToastContainer className="p-3" position="top-end">
                    <Toast show={showA} onClose={() => toggleShowA(false)} className="" delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Follow A New User</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>Request finished!</Toast.Body>
                    </Toast>
                </ToastContainer>
                <Card.Header as="h5">Follow A New User</Card.Header>
                <Card.Body className="d-flex flex-row justify-content-start overflow-auto"
                           style={{minHeight: 80, maxHeight: 500}}>
                    <Form className="d-flex w-50 me-3" ref={form} onSubmit={handleSearch} noValidate
                          validated={validated}>
                        <InputGroup hasValidation
                                    style={{minWidth: "150px", maxWidth: "250px", height: "30px"}}>

                            <Form.Control
                                type="text"
                                placeholder="Please input a username"
                                aria-describedby="inputGroupPrepend"
                                className="me-2 ms-2"
                                required
                                onChange={onChangeUsername}

                            />
                            <Form.Control.Feedback type="invalid" className="  me-2 ms-5">
                                Please input a username!
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Button variant="outline-success" type="submit" disabled={loading}
                                className="d-inline-block"
                                style={{height: "40px"}}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : "Search"}
                        </Button>
                        {message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                    </Form>
                    {showSearchResult ?
                        <Table striped bordered hover size="sm" className="">
                            <thead>
                            <tr>
                                <th> #</th>
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Nick Name</th>

                            </tr>
                            </thead>
                            <tbody>
                            {
                                showFollowersTable && searchResult.map((user, index) => (<tr key={user.username}>
                                        <td>{index}</td>
                                        <td>{user.username}</td>
                                        <td>{user.fname}</td>
                                        <td>{user.lname}</td>
                                        <td>{user.nickname}</td>
                                        <td className="d-flex justify-content-center">
                                            <Button variant="outline-danger" className="p-1 m-1"
                                                    onClick={(e) => handleNewRequest(e, user.username, index)}
                                                    disabled={loading}>Request</Button>
                                        </td>
                                    </tr>)
                                )
                            }


                            </tbody>
                        </Table> :

                        <Collapse in={searchResult !== undefined}>
                            <Alert
                                variant="outlined" severity="info" color="error"
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setSearchResult(undefined);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit"/>
                                    </IconButton>
                                }
                                sx={{mb: 2}}
                            >
                                No Result
                            </Alert>
                        </Collapse>
                    }
                </Card.Body>
            </Card>


            <Card border="light" className="rounded-3">
                <Card.Header as="h5">Follower List</Card.Header>
                <Card.Body className="overflow-auto" style={{maxHeight: 500}}>
                    {showFollowersTable ? <List
                            sx={{bgcolor: 'background.paper'}}
                            aria-label="contacts"
                        >
                            {followers.map((follower, index) => {
                                    return (
                                        <div key={follower.follower}>
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <SentimentVerySatisfiedIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={follower.follower}/>
                                                </ListItemButton>

                                            </ListItem>
                                            <Divider variant="inset" component="li"/>
                                        </div>

                                    )
                                }
                            )}


                        </List> :
                        <Alert className="w-25" variant="outlined" severity="info" color="info">No follower yet. Try
                            to
                            follow someone!</Alert>
                    }

                </Card.Body>
            </Card>


        </>
    )
}