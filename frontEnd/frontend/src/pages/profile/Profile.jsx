import './Profile.scss';
import profile from '../../assets/image/profile.png'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineDataSaverOn } from 'react-icons/md';
import Navbar from "../../components/navbar/Navbar";
import Follow from './followpage/follow';
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addtopost, addtoreel, savePost } from '../../store/Store'


export default function Profile() {
    const post = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState("");
    const [user, setUser] = useState();
    const [toggle, setToggle] = useState(false);
    const [buttonType, setButtonType] = useState("");
    const [followers, setFollowers] = useState([]);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const data = JSON.parse(localStorage.getItem('Data'));
    // console.log("ss", userData)
    useEffect(() => {
        if (userData) {
            axios.post('http://localhost:9000/getpostbyID', { Id: userData._id })
                .then(response => {
                    // setPosts(response.data.data);
                    dispatch(addtopost(response.data.data));
                    dispatch(addtoreel(response.data.data));
                    dispatch(savePost(response.data.data));
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('img', avatar);
        formData.append('user', userData._id);

        try {
            // toast.warn('Loading');
            const response = await axios.post('http://localhost:9000/updatepost', formData);
            if (response.data) {
                toast.success(response.data.message);
            }
            const user = response.data.user
            localStorage.setItem('Data', JSON.stringify(user));


        } catch (error) {
            console.log('fail', error);
        }
    };

    //Handlefollow
    const handleFollow = async (e, id, localId) => {
        try {
            e.preventDefault();
            const response = await axios.post('http://localhost:9000/user/followers', {
                userId: id,
                localUser: localId,
            });
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            if (response.data) {
                toast.success(response.data.message);
                // Update the follower count in real-time
                const updatedUserData = { ...userData, followers: response.data.user.followers };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
                setUser(updatedUserData); // Assuming you have a 'setUser' function from the useState hook to update the user data state
            }
        } catch (error) {
            console.log('fail', error);
        }
    };

    //Handle Follow Window show and hide
    const handleChange = (newToggle) => {
        setToggle(newToggle);
    };

    const handleButtonClick = async (buttonName) => {

        setToggle(true);
        setButtonType(buttonName);
        try {
            const response = await axios.post('http://localhost:9000/user/getfollowers', {
                buttonName: buttonName,
                userId: userData._id,
            });
            const followers = response.data.follower;
            setFollowers(followers);
        } catch (error) {
            console.log('fail', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="user">
                    <div className="img_profile">
                        {/* <img src={avatar || profile} alt="proile" className="" /> */}
                        <img src={userData && userData.avatar ? userData.avatar : profile} className="img-circle img-fluid" alt="Profile" />
                        <form onSubmit={handleSubmit}>
                            <input
                                type="file"
                                encType="multipart/form-data"
                                onChange={e => setAvatar(e.target.files[0])}
                                id="file"
                            />
                            <button><MdOutlineDataSaverOn /></button>
                        </form>

                    </div>
                    <div className="user_data">

                        <h2>{userData ? userData.username : "Alston"}
                            <button
                                type="button"
                                style={{ display: userData && userData._id == data._id ? "none" : "block" }}
                                onClick={((e) => { handleFollow(e, userData._id, data._id) })}
                            >{userData && userData.followers && userData.followers.includes(data._id) ? "Unfollow" : "Follow"}</button>
                        </h2>
                        <p>Bio</p>
                        <ul>
                            <li><strong>{post.length}</strong> posts</li>
                            <li onClick={(() => { handleButtonClick("Followrs") })}><strong>{userData.followers ? userData.followers.length : ""}</strong> followers</li>
                            <li onClick={(() => { handleButtonClick("Following") })}><strong>{userData.following ? userData.following.length : ""}</strong> following</li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className='row_data'>
                    <span><Link to="/profile/post">Post</Link></span>
                    <span><Link to="/profile/reel">Reel</Link></span>
                    <span><Link to="/profile/save">Saved</Link></span>
                    <span><Link to="/profile/tag">Taged</Link></span>
                </div>
                <Outlet />

                <Follow
                    user={followers}
                    toggle={toggle}
                    buttonType={buttonType}
                    handleChange={handleChange}
                    handleFollow={handleFollow}
                />

            </div>
        </div >
    );
}
