import './Navbar.scss'
import { Link } from 'react-router-dom';
// import Profile from '../../'
import profile from '../../assets/image/profile.png';
function Navbar() {

    const data = localStorage.getItem('Data');
    let parsedData;
    if (data) {
        parsedData = JSON.parse(data);
    } else {
        console.log('No data found in localStorage.');
    }
    return (
        <div className='navbar'>
            <div className="navbar__left">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span>Alston</span>
                </Link>
            </div>
            <div className="navbar__right">
                <img src={parsedData ? parsedData.avatar : profile} alt="profile" />
            </div>
        </div >
    )
}

export default Navbar;