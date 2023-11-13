import './Sidebar.scss';
import axios from 'axios';
import { URL } from '../../../../endepointURL';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { MdSlowMotionVideo } from 'react-icons/md';
import { BsPlusCircle, BsChatLeft } from 'react-icons/bs'
import { AiOutlineHeart, AiOutlineHome, AiOutlineMessage } from 'react-icons/ai'
import profile from '../../../assets/image/profile.png'
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const toggle = useSelector((state) => state.sidebartoggle);
    const [user, setUser] = useState([]);
    const [stoggle, setSToggle] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));

    useEffect(() => {
        // Function to update windowWidth state when the window is resized
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        // Listen for window resize events and update the windowWidth state
        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fetch user data from the server using Axios
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${URL}/user`);
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Handle click on user profile link
    const handleUserProfile = async (e, data) => {
        e.preventDefault();
        try {
            localStorage.setItem('userData', JSON.stringify(data));
            // Redirect to the profile page
            navigate('/profile/post');
        } catch (error) {
            console.log('fail', error);
        }
    }

    return (
        <div className="sidebar bg-white top-0 h-full border-r border-ig-separator flex flex-col overflow-y-scroll overflow-x-hidden mb-50 text-white"
            style={{ width: windowWidth > 450 || toggle ? "80%" : "0", position: windowWidth > 450 ? "sticky" : "absolute", }} >
            <div className="user__profile flex items-center gap-5 m-4 mb-0 py-2 px-4 rounded-3xl" onClick={((e) => { handleUserProfile(e, data) })}>
                <img className='w-9 h-9 rounded-full' src={data ? data.avatar : profile} />
                <h4>{data && data.avatar ? data.username : "Alston"}</h4>
            </div>
            <div className="logo-wrapper"></div>
            <ul className="sidebar-menu font-1rem list-none p-0 pl-8 flex flex-col">
                <li>
                    <Link to='/home' className="nav-link">
                        <span className="icon">
                            <AiOutlineHome />
                        </span>
                        <p>Home</p>
                    </Link>
                </li>
                <li>
                    <Link to="about" className="nav-link">
                        <span className="icon">
                            <BsChatLeft />
                        </span>
                        <p>About</p>
                    </Link>
                </li>
                <li>
                    <Link to="/home/reels" className="nav-link">
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

            <ul className="sidebar-menu font-1rem list-none p-0 pl-8 flex flex-col bottom">
                <li>
                    <a href="#" className="nav-link">
                        <p>More</p>

                    </a>
                </li>
            </ul>
            <hr style={{ width: "90%" }} />
            <div className="sidebarFriend flex flex-col gap-2.5">
                <h3 className=' text-center text-white p-5 rounded-2xl' style={{ width: "90%" }}>Friends</h3>
                {user.map((data, index) => (
                    <li className='sidebar__User flex items-center my-1 gap-2.5 no-underline text-black' key={index} onClick={((e) => { handleUserProfile(e, data) })} >
                        <img className='w-9 h-9 rounded-full' src={data.avatar ? data.avatar : profile} />
                        <span className="sidebarFrindName">{data.username}</span>
                    </li>
                ))}
            </div>

        </div >
    );
}
