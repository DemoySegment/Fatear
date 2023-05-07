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


CloseIcon.propTypes = {fontSize: PropTypes.string};
export default function FriendPage() {
    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);
    const [showC, setShowC] = useState(false);

    const [friends, setFriends] = useState(undefined);
    const [needUpdateFriends, setneedUpdateFriends] = useState(false);
    const [requestsTo, setRequestsTo] = useState(undefined);
    const [needUpdateRequestsTo, setneedUpdateRequestsTo] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [searchResult, setSearchResult] = useState(undefined);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const showSearchTable = searchResult && searchResult.length !== 0
    const showRequestToTable = requestsTo && requestsTo.length !== 0
    const showFriendTable = friends && friends.length !== 0;
    const form = useRef();


    useEffect(() => {
        friendPageService.getFriends().then(response => {
            console.log(response.data.result)
            setFriends(response.data.result)

        })
            .catch(e => {
                console.log(e)
            });
        friendPageService.getRequestsTo().then(response => {
            console.log(response.data.result)
            setRequestsTo(response.data.result)

        })
            .catch(e => {
                console.log(e)
            });


    }, [needUpdateFriends, needUpdateRequestsTo]);

    const toggleShowA = (state) => setShowA(state);

    const toggleShowB = (state) => setShowB(state);

    const toggleShowC = (state) => setShowC(state);

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
        friendPageService.searchUser(searchUser).then(response => {
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

        friendPageService.newFriendRequest(username).then(response => {
                console.log(response.data.result);
                setLoading(false);
                let tem = searchResult.slice();
                tem.splice(index, 1);
                setSearchResult(tem);

                setneedUpdateFriends(!needUpdateFriends)
                setneedUpdateRequestsTo(!needUpdateRequestsTo)
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

    const acceptRequest = (e, username, index) => {

        e.preventDefault();
        setMessage("");
        setLoading(true);

        friendPageService.acceptFriendRequest(username, index).then(response => {
                console.log(response.data.result);
                setLoading(false);
                let tem = requestsTo.slice();
                tem.splice(index, 1);
                setRequestsTo(tem);

                setneedUpdateFriends(!needUpdateFriends)
                setneedUpdateRequestsTo(!needUpdateRequestsTo)
                toggleShowB(true)
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
            }
        )
    }

    const rejectRequest = (e, username, index) => {

        e.preventDefault();
        setMessage("");
        setLoading(true);

        friendPageService.rejectFriendRequest(username, index).then(response => {
                console.log(response.data.result);
                setLoading(false);
                let tem = requestsTo.slice();
                tem.splice(index, 1);
                setRequestsTo(tem);

                setneedUpdateFriends(!needUpdateFriends)
                setneedUpdateRequestsTo(!needUpdateRequestsTo)
                toggleShowC(true)
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
            }
        )
    }


    return (
        <>
            <h1> Friends</h1>
            <Card border="light" className="rounded-3">
                <ToastContainer className="p-3" position="top-end">
                    <Toast show={showA} onClose={() => toggleShowA(false)} className="" delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">New Request</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>Request sent!</Toast.Body>
                    </Toast>
                </ToastContainer>
                <Card.Header as="h5">Send a Request</Card.Header>
                <Card.Body className="d-flex flex-row justify-content-start overflow-auto" style={{minHeight:80 ,maxHeight: 500}}>
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
                    {showSearchTable ?
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
                                showSearchTable && searchResult.map((user, index) => (<tr key={user.username}>
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
                <Card.Header as="h5">New Requests To You</Card.Header>
                <Card.Body className="overflow-auto" style={{minHeight:80 ,maxHeight: 500}}>
                    <ToastContainer className="p-3" position="top-end">
                        <Toast show={showB} onClose={() => toggleShowB(false)} className="" delay={3000} autohide bg="success" >
                            <Toast.Header>
                                <strong className="me-auto">New Operation</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>Request Accept!</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    <ToastContainer className="p-3" position="top-end">
                        <Toast show={showC} onClose={() => toggleShowC(false)} className="" delay={3000} autohide bg="danger">
                            <Toast.Header>
                                <strong className="me-auto">New Operation</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>Request Rejected!</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    {showRequestToTable ? <Table striped bordered hover size="sm">
                            <thead className="text-center">
                            <tr>
                                <th>#</th>
                                <th>SentBy</th>
                                <th>Date</th>
                                <th>Option</th>
                            </tr>
                            {requestsTo.map((request, index) => <tr className="align-middle"
                                                                    key={request.requestSentBy}>
                                <td>{index}</td>
                                <td>{request.requestSentBy}</td>
                                <td>{request.createdAt}</td>

                                <td className="d-flex justify-content-center">
                                    <Button variant="outline-success" className="p-1 m-1"
                                            disabled={loading} onClick={(e)=>acceptRequest(e,request.requestSentBy, index)}>
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : "Accept"}</Button>
                                    <Button variant="outline-danger" className="p-1 m-1"
                                            disabled={loading} onClick={(e)=>rejectRequest(e,request.requestSentBy, index)}>
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                            ) : "Reject"}</Button>
                                </td>
                            </tr>)}
                            </thead>
                        </Table> :
                        <Alert className="w-25" variant="outlined" severity="info" color="info">No new requests to
                            you.</Alert>
                    }


                </Card.Body>
            </Card>

            <Card border="light" className="rounded-3">
                <Card.Header as="h5">Friend List</Card.Header>
                <Card.Body className="overflow-auto" style={{minHeight:80 ,maxHeight: 500}}>
                    {showFriendTable ? <List
                            sx={{bgcolor: 'background.paper'}}
                            aria-label="contacts"
                        >
                            {friends.map((friend, index) => {
                                    return (
                                        <div key={friend.username}>
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <SentimentVerySatisfiedIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={friend.username}/>
                                                </ListItemButton>

                                            </ListItem>
                                            <Divider variant="inset" component="li"/>
                                        </div>

                                    )
                                }
                            )}


                        </List> :
                        <Alert className="w-25" variant="outlined" severity="info" color="info">No friends yet. Try
                            to
                            send a new request!</Alert>
                    }

                </Card.Body>
            </Card>


        </>
    )
}