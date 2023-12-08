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
        <div className="navbar flex items-center justify-around px-5 py-7">
            <div className="navbar__left">
                <Link to="/home" style={{ textDecoration: "none" }} className="text-2xl text-black transition-transform duration-300 hover:border-2 hover:border-black hover:rounded-lg">
                    <span>Alston</span>
                </Link>
            </div>
            <div className="navbar__right flex items-center gap-4 text-lg">
                <img src={data ? data.avatar : profile} alt="profile" className='cursor-pointer w-10 h-10 rounded-full-pointer' onClick={((e) => { handleUserProfile(e, data) })} />
            </div>
        </div >
    )
}

export default Navbar;