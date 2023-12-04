import './Navbar.scss'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import profile from '../../assets/image/profile.png';
function Navbar() {
    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));
    const navigate = useNavigate();
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
        <div className='navbar'>
            <div className="navbar__left">
                <Link to="/home" style={{ textDecoration: "none" }}>
                    <span>Social Chat</span>
                </Link>
            </div>
            <div className="navbar__right">
                <img src={data ? data.avatar : profile} alt="profile" className='cursor-pointer' onClick={((e) => { handleUserProfile(e, data) })} />
            </div>
        </div >
    )
}

export default Navbar;