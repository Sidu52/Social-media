import './Sidebar.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineHome, AiOutlineSearch, AiOutlineMessage } from 'react-icons/ai'
import { BsPlusCircle, BsChatLeft } from 'react-icons/bs'
import { MdSlowMotionVideo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import profile from '../../../assets/image/profile.png'
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const cart = useSelector((state) => state.user);
    const [user, setUser] = useState([]);

    const data = localStorage.getItem('Data');
    let parsedData;
    if (data) {
        parsedData = JSON.parse(data);
    } else {
        console.log("No data found in localStorage.");
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:9000/user");
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleUserProfile = async (e, data) => {
        e.preventDefault();
        try {
            localStorage.setItem('userData', JSON.stringify(data));
            // Redirect to the profile page
            window.location.href = '../../../profile/post';
        } catch (error) {
            console.log('fail', error);
        }
    }

    return (
        <div className="sidebar">
            <div className="user__profile">
                <img src={parsedData ? parsedData.avatar : profile} />
                <h4>{parsedData && parsedData.avatar ? parsedData.username : "Alston"}</h4>
            </div>
            <div className="logo-wrapper"></div>
            <ul className="sidebar-menu">
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineHome />
                        </span>
                        <p>Home</p>
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <BsChatLeft />
                        </span>
                        <p>Chat</p>
                    </a>
                </li>
                <li>
                    <Link to="/reels" className="nav-link">
                        <span className="icon">
                            <MdSlowMotionVideo />
                        </span>
                        <p>Reels</p>
                    </Link>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineMessage />
                        </span>
                        <p>Messages</p>
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineHeart />
                        </span>
                        <p>Notifications</p>
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <BsPlusCircle />
                        </span>
                        <p>Setting</p>
                    </a>
                </li>
            </ul>

            <ul className="sidebar-menu bottom">
                <li>
                    <a href="#" className="nav-link">
                        <p>More</p>

                    </a>
                </li>
            </ul>
            <hr style={{ width: "90%" }} />
            <div className="sidebarFriend">
                <h3>Friends</h3>
                {user.map((data, index) => (
                    <li className='sidebar__User' key={index} onClick={((e) => { handleUserProfile(e, data) })} >
                        <img src={data.avatar ? data.avatar : profile} />
                        <span className="sidebarFrindName">{data.username}</span>
                    </li>
                ))}
            </div>

        </div >
    );
}
