import './Sidebar.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineHome, AiOutlineSearch, AiOutlineMessage } from 'react-icons/ai'
import { BsPlusCircle, BsChatLeft } from 'react-icons/bs'
import { BiSolidUserCircle } from 'react-icons/bi';
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
                        Home
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineSearch />
                        </span>
                        Search
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <BsChatLeft />
                        </span>
                        Chat
                    </a>
                </li>
                <li>
                    <Link to="/reels" className="nav-link">
                        <span className="icon">
                            <MdSlowMotionVideo />
                        </span>
                        Reels
                    </Link>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineMessage />
                        </span>
                        Messages
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineHeart />
                        </span>
                        Notifications
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <BsPlusCircle />
                        </span>
                        Setting
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link active">
                        <img
                            className="icon rounded-circle"
                            src="https://avatars.githubusercontent.com/u/1743919?v=4"
                            alt="Profile icon"
                        />
                        Profile
                    </a>
                </li>
            </ul>

            <ul className="sidebar-menu bottom">
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            {/* Add the icon component */}
                        </span>
                        More
                    </a>
                </li>
            </ul>
            <hr style={{ width: "90%" }} />
            <div className="sidebarFriend">
                <h3>Friends</h3>
                {user.map((data, index) => (
                    <li key={index} >
                        <img src={data.avatar ? data.avatar : profile} />
                        <span className="sidebarFrindName">{data.username}</span>
                    </li>
                ))}
            </div>

        </div >
    );
}
