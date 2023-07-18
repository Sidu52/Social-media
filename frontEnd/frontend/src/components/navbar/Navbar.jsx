import './Navbar.scss'
import { Link } from 'react-router-dom';
// import Profile from '../../'
import profile from '../../assets/image/profile.png';
function Navbar(userAvtar) {
    return (
        <div className='navbar'>
            <div className="navbar__left">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span>Alston</span>
                </Link>
            </div>
            <div className="navbar__right">
                <img src={userAvtar ? userAvtar.userAvtar : profile} alt="profile" />
            </div>
        </div >
    )
}

export default Navbar;