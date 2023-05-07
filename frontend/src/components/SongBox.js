import {Card, Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


export default function SongBox({song}){
    let navigate = useNavigate();
    function handleClick(songID) {
        navigate("/song?songID="+songID);
    }

    return (
        <>
            <Card style={{ width: '250px', minHeight: '220px' }} className="d-flex btn-outline-danger align-content-sm-start rounded-4" as={Button} onClick={()=>handleClick(song.songID)}>
                <Card.Body >
                    <Card.Title className="fs-2 text-start" >{song.title}</Card.Title>
                    <Card.Subtitle className="mb-2 font-weight-light">{song.artist_list.join(", ")}</Card.Subtitle>

                </Card.Body>
            </Card>
        </>
    )

}