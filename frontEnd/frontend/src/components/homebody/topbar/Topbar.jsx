import { useState, useEffect } from 'react';
import './Topbar.scss';
import axios from 'axios';
import { URL } from '../../../../endepointURL';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { AiOutlineBars } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { BsSearch } from 'react-icons/bs';
import Logo from '../../../assets/image/logo.png'
import profile from '../../../assets/image/profile.png'
import { useSelector, useDispatch } from 'react-redux';
import { setsideToggle } from '../../../store/Store';
const Topbar = () => {
    const sidbartoggle = useSelector((state) => state.sidebartoggle);

    // State variables
    const [toggle, setToggle] = useState(false); // For the dropdown toggle
    const [user, setUser] = useState([]);// To store the user data fetched from the server
    const [searchValue, setSearchValue] = useState("");// To hold the value of the search input
    const [searchItem, setSearchItem] = useState([]); // To store the search results
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Redux dispatch hook
    const dispatch = useDispatch();
    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));

    // Fetch user list from the server on component mount
    useEffect(() => {
        // Function to update windowWidth state when the window is resized
        const handleResize = () => {
            if (window.innerWidth <= 450) {
                dispatch(setsideToggle(false));
            } else {
                dispatch(setsideToggle(true));
            }
        };
        // Listen for window resize events and update the windowWidth state
        window.addEventListener('resize', handleResize);

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${URL}/user`);
                const userData = response.data.data;
                setUser(userData);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
        // Clean up the event listener when the component unmounts
        // return () => {
        //     window.removeEventListener('resize', handleResize);
        // };
    }, []);


    // Set local storage data for profile show
    const handleLinkClick = () => {
        localStorage.setItem('userData', JSON.stringify(data));
    };
    // Handle searching user
    const handleSerach = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
        const userInput = e.target.value.toLowerCase();
        // Filter the items array based on the user's input
        const matchingItems = user.filter(item =>
            item.username.toLowerCase().includes(userInput) ||
            item.email.toLowerCase().includes(userInput)
        );
        setSearchItem(matchingItems);
    }
    const handleIconClick = (e, value) => {
        e.preventDefault();
        dispatch(setsideToggle(value));
    };
    return (
        <nav >
            <div className="topnavbar">
                <div className="topnavbar__left">
                    <div style={{ display: window.innerWidth <= 450 ? "block" : "none" }}>
                        {!sidbartoggle
                            ? <AiOutlineBars onClick={((e) => handleIconClick(e, true))} />
                            : <RxCross1 onClick={((e) => handleIconClick(e, false))} />}
                    </div>
                    <Link className="topnavbar__brand">
                        <img src={Logo} alt="SS Logo" className="logo-img" style={{ width: '50px' }} />
                    </Link>
                    <ul className="topnavbar__nav">
                        <li className="topnavbar__nav-item">
                            <Link to='/home' className="topnavbar__nav-link">Home</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link to='/home/about' className="topnavbar__nav-link">About</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link className="topnavbar__nav-link">Vision</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link to="/home/contact" className="topnavbar__nav-link">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="topnavbar__right">
                    <form className="topnavbar__form">
                        <div className="search-wrapper">
                            <input className="form-control" type="text" placeholder="Search" value={searchValue} onChange={((e) => { handleSerach(e) })} style={{ padding: "5px 10px" }} />
                            <button type="submit" className="search-button">
                                <BsSearch />
                            </button>
                            <div style={{ display: searchValue == "" ? "none" : "block" }} className='search_box'>
                                {searchItem.map((user, index) => (
                                    <div className="searchUserData">
                                        <img src={user.avatar} alt="prfile" />
                                        <p>{user.username}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                    <div className="dropdown nav-item">
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" onMouseEnter={(e) => setToggle(true)} onMouseLeave={(e) => setToggle(false)}>
                            <img src={data && data.avatar ? data.avatar : profile} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                        </button>
                        <ul className="dropdown-menu" style={{ display: toggle ? "flex" : "none", borderRadius: "20px" }} onMouseEnter={(e) => setToggle(true)} onMouseLeave={(e) => setToggle(false)}>
                            {!data ?
                                <>
                                    <li><Link className="dropdown-item" to="/form/signup">Register</Link></li>
                                    <li><Link className="dropdown-item" to="/form/signin">Sign in</Link></li>
                                </> :
                                <>
                                    <li><Link className="dropdown-item" to="/profile/post" onClick={handleLinkClick} >Profile</Link></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                   
                                </>}
                        </ul>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Topbar;
