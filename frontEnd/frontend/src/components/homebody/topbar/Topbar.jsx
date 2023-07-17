import React, { useState } from 'react';
import './Topbar.scss';
import { BsSearch } from 'react-icons/bs';
import { BiSolidUserCircle } from 'react-icons/bi';
import Logo from '../../../assets/image/logo.png'
import profile from '../../../assets/image/profile.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const data = JSON.parse(localStorage.getItem('Data'));

const Topbar = () => {

    const [toggle, setToggle] = useState(false);

    const userSignout = async () => {
        try {
            // toast.warn('Loading');
            const response = await axios.post('http://localhost:9000/user/signout');
            if (response.data) {
                localStorage.clear();
                toast.success(response.data.message);
                // Remove session cookies
                document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            }

        } catch (error) {
            console.log('fail', error);
        }
    }
    //set Localuse for profile show
    const handleLinkClick = () => {
        localStorage.setItem('userData', JSON.stringify(data));
    };

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
                            <input className="form-control me-2 p-1 ps-2" type="text" placeholder="Search" />
                            <button type="submit" className="search-button">
                                <BsSearch />
                            </button>
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
