import React, { useState, useEffect } from 'react';
import './Topbar.scss';
import { BsSearch } from 'react-icons/bs';
import Logo from '../../../assets/image/logo.png'
import profile from '../../../assets/image/profile.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Topbar = () => {
    const [toggle, setToggle] = useState(false);
    const [user, setUser] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [searchItem, setSearchItem] = useState([]);

    const data = JSON.parse(localStorage.getItem('Data'));// get user value from local storage

    //find user list
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:9000/user");
                const userData = response.data.data;
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const userSignout = async () => {
        try {
            // toast.warn('Loading');
            const response = await axios.post('http://localhost:9000/user/signout');
            if (response.data) {
                localStorage.clear();
                toast.success(response.data.message);
                window.location.reload();
                // Remove session cookies
                document.cookie = 'connect.sidhu; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            }

        } catch (error) {
            console.log('fail', error);
        }
    }
    //set Localuse for profile show
    const handleLinkClick = () => {
        localStorage.setItem('userData', JSON.stringify(data));
    };
    //Handle Searching user
    const handleSerach = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
        const userInput = e.target.value.toLowerCase();
        // Filter the items array based on the user's input
        const matchingItems = user.filter(item =>
            item.username.toLowerCase().includes(userInput) || // Adjust this condition based on the property you want to search for
            item.email.toLowerCase().includes(userInput)
        );
        setSearchItem(matchingItems);
    }

    return (
        <nav >
            <div className="topnavbar">
                <div className="topnavbar__left">
                    <Link className="topnavbar__brand">
                        <img src={Logo} alt="SS Logo" className="logo-img" style={{ width: '50px' }} />
                    </Link>
                    <ul className="topnavbar__nav">
                        <li className="topnavbar__nav-item">
                            <Link className="topnavbar__nav-link">Home</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link className="topnavbar__nav-link">About</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link className="topnavbar__nav-link">Vision</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link className="topnavbar__nav-link">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="topnavbar__right">
                    <form className="topnavbar__form">
                        <div className="search-wrapper">
                            <input className="form-control" type="text" placeholder="Search" value={searchValue} onChange={((e) => { handleSerach(e) })} />
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
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" onClick={((e) => { setToggle(!toggle) })}>
                            {/* <BiSolidUserCircle style={{ fontSize: "30px" }} /> */}
                            <img src={data && data.avatar ? data.avatar : profile} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />

                        </button>
                        <ul className="dropdown-menu" style={{ display: toggle ? "flex" : "none" }}>
                            <li><Link className="dropdown-item" to="/form/signup">Register</Link></li>
                            <li><Link className="dropdown-item" to="/form/signin">Sign in</Link></li>

                            <li><Link className="dropdown-item" to="/profile/post" onClick={handleLinkClick} >Profile</Link></li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><Link className="dropdown-item" onClick={userSignout}>Logout</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Topbar;
