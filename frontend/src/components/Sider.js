import {Nav} from "react-bootstrap";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import PersonIcon from '@mui/icons-material/Person';
import Container from "react-bootstrap/Container";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

export default function Sidebar() {
    const navLinkClass = "list-group-item list-group-item-action list-group-item-light p-3";
    const linkPages = [{name: "Explore", icon: <NewReleasesIcon/>, to: '/'}, {
        name: "News",
        icon: <AnnouncementIcon />,
        to: '/news'}
    // , {
    //     name: "Profile",
    //     icon: <PersonIcon/>,
    //
    //     to: '/'
    // },
        , {name: "Friend", icon: <Diversity3Icon/>, to: '/friend'},
        {name: "Follow", icon: <SubscriptionsIcon/>, to: '/follow'},
        // {name: "Subscription", icon: <FavoriteIcon/>, to: '/'},
    ];

    return (
        <div className="border-end bg-white h-100 position-fixed" id="sidebar-wrapper" >

            <Nav className="list-group list-group-flush  h-100">
                {linkPages.map(nav => {
                    return (
                        <Nav.Link className={navLinkClass} key={nav.name} href={nav.to}>
                            <Container className=" d-inline-flex align-items-center">
                                <Container className="w-25">
                                    {nav.icon}
                                </Container>
                                <Container >
                                    {nav.name}
                                </Container>

                            </Container>
                        </Nav.Link>
                    );
                })}

            </Nav>
        </div>
    );
}
;