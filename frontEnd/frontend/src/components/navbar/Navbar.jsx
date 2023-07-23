import './Navbar.scss'
import { Link } from 'react-router-dom';
import profile from '../../assets/image/profile.png';
function Navbar() {
    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));

    return (
        <div className='navbar'>
            <div className="navbar__left">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span>Social Chat</span>
                </Link>
            </div>
            <div className="navbar__right">
                <img src={data ? data.avatar : profile} alt="profile" />
            </div>
        </div >
    )
}

export default Navbar;