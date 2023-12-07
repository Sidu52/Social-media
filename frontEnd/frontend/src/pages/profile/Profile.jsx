
import './Profile.scss';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../Context/Mycontext';
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addtopost, addtoreel, savePost, setLoading } from '../../store/Store';
import profile from '../../assets/image/profile.png';
import Sidebar from '../../components/homebody/sidebar/Sidebar';
import { LuGrid } from "react-icons/lu";
import { MdClose, MdOutlineSlowMotionVideo } from "react-icons/md";
import { LiaSave } from "react-icons/lia";
import { IoPricetagsOutline, IoSettingsOutline } from "react-icons/io5";
import { toast } from 'react-toastify';

export default function Profile() {
    // Redux state and dispatch
    const posts = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { URL, socket } = useContext(MyContext);
    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));
    const userData = JSON.parse(localStorage.getItem('userData'));


    // State variables for user profile data and interactions
    const [user, setUser] = useState({});
    const [form, setForm] = useState({
        imgurl: userData?.avatar || "",
        bio: userData?.bio || "",
        gender: userData?.gender || ""
    });
    const [settingToggle, setSettingToggle] = useState(false);
    const [followUnfollowToggle, setFollowUnfollowToggle] = useState("");
    const [toggle, setToggle] = useState(false);
    const [profiletoggle, setProfiletoggle] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [file, setFile] = useState();


    // Fetch user data and posts from the server on component mount
    useEffect(() => {
        if (userData) {
            axios.post(`${URL}/getbyID`, { Id: userData._id })
                .then(response => {
                    const { data, user } = response.data;
                    setUser(user)
                    dispatch(addtopost(data));
                    dispatch(addtoreel(data));
                    dispatch(savePost(data));
                })
                .catch(error => {
                    console.log(error);
                });
        }
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

    // Profile update function for changing avatar
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('img', form.imgurl);
        formData.append('id', userData._id);
        formData.append('bio', form.bio);
        formData.append('gender', form.gender);
        try {
            setProfiletoggle(false)
            dispatch(setLoading(true));
            const response = await axios.post(`${URL}/updateUser`, formData);
            if (response.data) {
                const updatedUser = response.data.user; // New user data received from the server
                setUser(updatedUser); // Update the user state with the new user data
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                if (updatedUser.email === data.email) {
                    console.log(updatedUser)
                    localStorage.setItem('Data', JSON.stringify(updatedUser));
                }
                dispatch(setLoading(false));
            }
        } catch (error) {
            console.log('fail', error);
        }
    };

    // Function to handle follow/unfollow actions
    const handleFollow = async (id, localId) => {
        try {
            const response = await axios.post(`${URL}/user/followers`, {
                userId: id,
                localUser: localId,
            });
            if (response.data && (userData?._id == id || userData?.id == localId)) {
                const updatedUserData = { ...userData, followers: response.data.user.followers };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
                // localStorage.setItem('Data', JSON.stringify(updatedUserData));
                setUser(updatedUserData);
            }
        } catch (error) {
            console.log('fail', error);
        }
    };
    const handleButtonClick = async (buttonName) => {
        try {
            const response = await axios.post(`${URL}/user/getfollowers`, {
                buttonName: buttonName,
                userId: user._id,
            });
            const followers = response.data.followers;
            setFollowers(followers);
        } catch (error) {
            console.log('Error:', error);
        }
    };
    // Function to sign out the user
    const userSignout = async () => {
        try {
            const response = await axios.post(`${URL}/user/signout`);
            if (response.data) {
                localStorage.clear();// Clear user data from local storage
                toast.success(response.data.message);// Show success message using toast
                // window.location.reload();// Refresh the page after sign out
                // Remove session cookies
                document.cookie = 'connect.sidhu; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                navigate("/home")
            }


        } catch (error) {
            console.log('fail', error);
        }
    }
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setForm({ ...form, imgurl: file })
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFile(reader.result);

            };
            reader.readAsDataURL(file);
            // Move to the next step after image upload
        }
        setCurrentStep(1)
    };
    // console.log(data?.followers.includes(user?.id))
    return (
        <div className='profile_container grid mx-4 ' >
            {profiletoggle ?
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <MdClose className='absolute top-0 max-sm:top-16 right-2 bg-gray-100 rounded-full text-4xl' onClick={() => setProfiletoggle(false)} />
                    <div className=" w-96 h-fit bg-white rounded-lg p-4">
                        <div className=' flex gap-3'>
                            <img className=' w-10 h-10 rounded-full' src={file || form.imgurl || profile} alt="" />
                            <span>
                                <p className='font-bold'>{userData ? userData.username : "Alston"}</p>
                                <label class="custum-file-upload" for="file">
                                    <p className='cursor-pointer text-blue-400'>Change_profile</p>
                                    <input type="file" id="file" onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
                                </label>

                            </span>

                        </div>
                        <hr className='mb-2' />
                        <span className='flex gap-2'>
                            <p>Bio:</p>
                            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} name="bio" cols="10" rows="5" className=' w-full  border-2 outline-none'></textarea>
                        </span>
                        <span className='flex w-full gap-2 mt-4 mb-2'>
                            <label htmlFor="Gender">Gender:</label>
                            <div className="radio">
                                <span className="radio_span">
                                    <input type="radio" name="Gender" value="male" defaultChecked={form.gender === "male"}
                                        onClick={(e) => setForm({ ...form, gender: e.target.value })} />
                                    <label>Male </label>
                                </span>

                                <span className="radio_span">
                                    <input type="radio" name="Gender" value="female" defaultChecked={form.gender === "female"}
                                        onClick={(e) => setForm({ ...form, gender: e.target.value })} />
                                    <label>Female </label>
                                </span>


                                <span className="radio_span">
                                    <input type="radio" name="Gender" value="other" defaultChecked={form.gender === "other"}
                                        onClick={(e) => setForm({ ...form, gender: e.target.value })} />
                                    <label>Other </label>
                                </span>
                            </div>
                        </span>

                        <button className=' bottom-1 rounded-lg py-2 px-4 my-2 bg-gray-100 cursor-pointer' onClick={handleSubmit}>Submit</button>
                    </div>
                </div> : null}

            {settingToggle ?
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <div className=" w-40 h-fit bg-white rounded-lg">
                        <ul className=' text-center'>
                            {data && data?._id === userData?._id ? <li className='py-2 cursor-pointer' onClick={userSignout} >LogOut</li> : null}
                            <hr />
                            <li className='py-2'>other</li>
                            <li className='py-2 cursor-pointer' onClick={() => setSettingToggle(false)}>cancel</li>
                        </ul>
                    </div>
                </div> : null}

            {followUnfollowToggle !== "" ?
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <div className=" w-96 h-80 bg-white rounded-lg">
                        <span className='relative py-2'>
                            <p className='text-center text-xl font-semibold py-3'>{followUnfollowToggle == "followers" ? "Followers" : followUnfollowToggle == "following" ? "Following" : null}</p>
                            <MdClose className='absolute top-2 right-2' onClick={() => { setFollowUnfollowToggle("") }} />
                        </span>
                        <hr />
                        <span className='w-full flex items-center justify-center py-2'>
                            <input type="search" placeholder='Search users...' className='w-11/12 mx-2 rounded-lg border p-2 outline-none pl-9 bg-gray-100' />
                        </span>
                        <div className='w-full h-full overflow-y-scroll'>
                            {followers.map(user => (
                                <div className='flex items-center justify-between mx-6 my-4'>
                                    <span className='flex items-center gap-2'>
                                        <img src={user.avatar || profile} alt="" className='w-10 h-10 rounded-full cursor-pointer' onClick={((e) => {
                                            setFollowUnfollowToggle("");
                                            handleUserProfile(e, user)
                                        })} />
                                        <p className=' cursor-pointer' onClick={((e) => {
                                            setFollowUnfollowToggle("");
                                            handleUserProfile(e, user)
                                        })}>{user.username}</p>
                                    </span>
                                    <p onClick={() => {
                                        handleFollow(user?._id, data?._id)
                                    }}>
                                        {data?.following?.includes(user?._id) ? "Unfollow" : "Follow"}
                                    </p>

                                </div>
                            ))}

                        </div>
                    </div>
                </div> : null}
            <Sidebar />
            <div className='max-lg:flex max-lg:flex-col max-lg:content-center h-screen'>
                <div className='flex gap-20 max-md:gap-10 max-sm:gap-6 my-5 leading-6'>
                    <div >
                        <img src={userData?.avatar || profile} className=" w-48 h-48 max-md:w-28 max-md:h-28 rounded-full" alt="Profile" />
                    </div>
                    <div>
                        <span className='relative flex items-center gap-6 max-sm:gap-2 max-sm:items-start max-sm:flex-col'>
                            <p className='font-bold'>{userData ? userData.username : "Alston"}</p>
                            {data?._id === userData?._id ? <p className=' bg-gray-100 px-3 py-1 rounded-lg cursor-pointer' onClick={() => setProfiletoggle(true)}>Edit Profile</p>
                                : <p className=' bg-gray-100 px-3 py-1 rounded-lg cursor-pointer' onClick={() => navigate(`/home/chat/${userData._id}`)}>Message</p>}
                            <p
                                className={`${userData?.followers && userData.followers.includes(data?._id) ? "bg-gray-100" : "bg-blue-500"} 
                                text-${userData?.followers && userData.followers.includes(data?._id) ? "black" : "white"}
                                 ${userData?._id === data?._id ? "hidden" : "block"} px-3 py-1 rounded-lg`}
                                onClick={() => { handleFollow(userData?._id, data?._id) }}
                            >
                                {userData?.followers && userData.followers.includes(data?._id) ? "Unfollow" : "Follow"}
                            </p>
                            <IoSettingsOutline onClick={() => setSettingToggle(true)} />
                        </span>

                        <span className='flex items-center gap-4 text-md  max-sm:hidden'>
                            <p> <strong>{posts.length || 0} </strong> posts</p>
                            <p onClick={() => {
                                setFollowUnfollowToggle("followers")
                                handleButtonClick("Followers")
                            }}
                            > <strong>{userData?.followers?.length || 0} </strong> followers</p>
                            <p
                                onClick={() => {
                                    setFollowUnfollowToggle("following")
                                    handleButtonClick("Following")
                                }}
                            ><strong>{userData?.following?.length || 0} </strong> following</p>
                        </span>
                        <span className='text-sm'>
                            <p>{form.gender}</p>
                            <span>
                                {form.bio.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </span>

                        </span>
                    </div>
                </div>
                <hr />
                <div className='h-full'>
                    <div className='hidden max-sm:flex items-center justify-around gap-5'>
                        <span className='flex flex-col items-center justify-center'>
                            <p className=''>{posts.length}</p>
                            <p>posts</p>
                        </span>
                        <span className='flex flex-col items-center justify-center'
                            onClick={() => {
                                setFollowUnfollowToggle("followers")
                                handleButtonClick("Followers")
                            }}>
                            <p className=''>{userData?.followers?.length || 0}</p>
                            <p>followers</p>
                        </span>
                        <span className='flex flex-col items-center justify-center'
                         onClick={() => {
                            setFollowUnfollowToggle("following")
                            handleButtonClick("Following")
                        }}>
                            <p className=''>{userData?.following?.length || 0}</p>
                            <p>following</p>
                        </span>
                    </div>
                    <hr />
                    <div className='flex items-center justify-center max-sm:justify-around py-5 gap-20 max-md:gap-14 max-sm:gap-5'>
                        <span><Link to="/profile/post" className='flex items-center gap-2'>
                            <LuGrid className='text-md max-sm:text-3xl' />
                            <p className='max-sm:hidden'>Post</p>
                        </Link></span>
                        <span><Link to="/profile/reel" className='flex items-center gap-2'>
                            <MdOutlineSlowMotionVideo className='text-md max-sm:text-3xl' />
                            <p className='max-sm:hidden'>Reel</p>
                        </Link></span>
                        <span><Link
                            // to="/profile/save"
                            to={"#"}
                            onClick={() => toast.success("Coming soon")}
                            className='flex items-center gap-2'>
                            <LiaSave className='text-md max-sm:text-3xl' />
                            <p className='max-sm:hidden'>Saved</p>
                        </Link></span>
                        <span><Link to="#" className='flex items-center gap-2'>
                            <IoPricetagsOutline className='text-md max-sm:text-3xl' onClick={() => toast.success("Coming Soon")} />
                            <p className='max-sm:hidden' onClick={() => toast.success("Coming Soon")}>Tagged</p>
                        </Link></span>
                    </div>
                    <div className=' flex-1 overflow-y-scroll'>
                        <Outlet />
                    </div>

                </div>
            </div>
        </div >
    );
}
