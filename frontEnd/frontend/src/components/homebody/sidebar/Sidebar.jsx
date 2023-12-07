import './Sidebar.scss';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react'
import { useDispatch } from "react-redux";
import { MyContext } from '../../../Context/Mycontext';
import { toast } from "react-toastify";
import { setLoading } from "../../../store/Store";
import { useSelector } from 'react-redux';
import { MdSlowMotionVideo } from 'react-icons/md';
import { CiSearch } from "react-icons/ci";
import { FaBarsStaggered } from "react-icons/fa6";
import { BsPlusCircle, BsChatLeft } from 'react-icons/bs'
import { AiOutlineHeart, AiOutlineHome, AiOutlineMessage } from 'react-icons/ai'
import profile from '../../../assets/image/profile.png'
import { Link, useNavigate } from 'react-router-dom';
import MultiStep from 'react-multistep'
import { FaRegFileImage } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import SignUp from '../../../pages/form/component/Signup';
import Login from '../../../pages/form/component/Signin';




export default function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { URL, posts, setPosts, onlineUser, socket } = useContext(MyContext);
    const [user, setUser] = useState([]);
    const [loginForm, setLoginForm] = useState("");
    const [stoggle, setSToggle] = useState(false);
    const [usersList, setUsersList] = useState(false);
    const [uploading, setUploading] = useState("");
    const [form, setForm] = useState({ content: "", imgurl: "" });
    const [currentStep, setCurrentStep] = useState(0);
    const [searchToggle, setSearchToggle] = useState("");
    const [dropdownToggle, setDropdownToggle] = useState(false);
    const [searchValue, setSearchValue] = useState("");// To hold the value of the search input
    const [searchItem, setSearchItem] = useState([]); // To store the search results
    const [notification, setNotifications] = useState([]);
    const [notificatiionCount, setNotificationcount] = useState(0);

    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));
    // Calculate time difference between current time and the time the post was uploaded
    const calculateTimeDifference = (uploadTime) => {
        const currentTime = new Date();
        const uploadTimestamp = new Date(uploadTime);
        const timeDifference = currentTime.getTime() - uploadTimestamp.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return "Just now";
        }
    };


    // Fetch user data from the server using Axios
    useEffect(() => {
        socket?.on("getNotification", data => {
            // if (notificatiionCount > 0) {
            //     setNotificationcount(prevCount => prevCount + 1);
            // } else {
            //     setNotificationcount(1);
            // }
            setNotificationcount(prevCount => prevCount + 1);
            setNotifications(prevNotifications => [data, ...prevNotifications]);
        })

    }, [socket])
    const fetchNotification = async () => {
        try {
            const response = await axios.post(`${URL}/toggle/notificationget`, { ID: data?._id });
            const notificationData = response?.data?.notificationData || [];
            const count = notificationData.reduce((accumulator, item) => {
                if (!item?.notification?.viewBy?.includes(data._id)) {
                    return accumulator + 1;
                }
                return accumulator;
            }, 0);
            console.log(count)
            setNotificationcount(count);
            setNotifications(notificationData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${URL}/user`);
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };


        fetchUserData();
        fetchNotification();
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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setForm({ ...form, imgurl: event.target.files[0] });
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploading(reader.result);

            };
            reader.readAsDataURL(file);
            // Move to the next step after image upload
        }
        setCurrentStep(1)
    };

    // Function to handle form submission and create a new post
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", form.content);
        formData.append("img", form.imgurl);
        formData.append("user", data._id);
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${URL}/createpost`, formData);
            if (response.data) {
                toast.success(response.data.message);
                const postDATA = response.data.data;
                // socket.emit('uploadPost', { user: data, post: postDATA, type: "Post_Upload" });
                socket?.emit("notificationsend", {
                    senderuserID: data?._id,
                    reciveruserID: data?.following,
                    notificationDes: `upload a post `,
                    postID: postDATA._id,
                    notificationType: "Post",
                    viewBy: []
                })
                setPosts([postDATA, ...posts]);
                dispatch(setLoading(false));
                setSToggle(false)
                setUploading("");
                setForm({ content: "", imgurl: "" });
            }

        } catch (error) {
            console.log("fail", error);
        }
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
        if (e.target.value.length == 0) {
            setSearchItem([])
        }
    }

    const handleRefresh = () => {
        if (window.location.hash === '#/home') {
            window.location.reload();
        }
    };

    const handleViewNotification = async (id) => {
        try {
            // navigate('')
            await axios.post(`${URL}/toggle/notificationUpdate`, { id, viewBy: data._id });
            setNotificationcount(prevCount => prevCount - 1);
            fetchNotification()
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {loginForm == "signup" ?
                <div className='absolute top-0 left-0 w-full h-full  bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <MdClose className='absolute top-0 max-sm:top-16 right-2 bg-gray-100 rounded-full text-4xl' onClick={() => setLoginForm("")} />
                    <SignUp />
                </div>
                : loginForm == "login" ?
                    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                        <MdClose className='absolute top-0 max-sm:top-16 right-2 bg-gray-100 rounded-full text-4xl' onClick={() => setLoginForm("")} />
                        <Login />
                    </div>
                    : null}
            {stoggle ?
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <MdClose className='absolute top-0 max-sm:top-16 right-2 bg-gray-100 rounded-full text-4xl'
                        onClick={() => setSToggle(false)} />
                    <div className='w-full flex items-center justify-center'>
                        <div className=' w-full h-80 max-w-lg py-5 mx-5' style={{ display: currentStep === 0 ? "block" : "none" }}>
                            <label for="file" className="flex flex-col items-center justify-center gap-5 cursor-pointer border-2 border-dashed border-gray-300 bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-center">
                                    <FaRegFileImage className='w-20 h-20' />
                                </div>
                                <div className="flex items-center justify-center">
                                    <span className="font-normal text-gray-500">Click to upload image</span>
                                </div>
                                <input type="file" id="file" className="hidden" onChange={handleImageUpload} accept="image/*,video/*" />
                            </label>
                        </div>
                        <div className="h-80 w-96 mx-5" style={{ display: currentStep == 1 ? "block" : "none" }}>
                            <div className='flex items-center justify-between p-4 bg-white'>
                                <FaArrowLeft className=' text-blue-500 text-xl' onClick={() => setCurrentStep(currentStep - 1)} />
                                <span className=' text-blue-500' onClick={() => setCurrentStep(currentStep + 1)} >next</span>
                            </div>
                            <img src={uploading} alt="img" className='h-full w-full' />
                        </div>
                        <div className="h-full w-2/5 mx-5 max-sm:w-5/6 overflow-hidden" style={{ display: currentStep == 2 ? "block" : "none" }}>
                            <div className='flex items-center justify-between p-4 bg-white'>
                                <FaArrowLeft className=' text-blue-500 text-xl' onClick={() => setCurrentStep(currentStep - 1)} />
                                <span className=' text-blue-500' onClick={(e) => handleSubmit(e)} >Post</span>
                            </div>
                            <div className="w-full h-80 grid grid-cols-2 max-sm:grid-cols-1 justify-center " >
                                <img src={uploading} alt="img" className='w-full h-full max-sm:h-44 bg-white' />
                                <div className='bg-white p-5'>
                                    <div className='flex gap-2'>
                                        <img src={data ? data.avatar : profile} alt="Profile" className='w-9 h-9 rounded-full' />
                                        <span>
                                            <p>{data?.username || "Alston"}</p>
                                        </span>
                                    </div >
                                    <div className='relative'>
                                        <textarea name="text" value={form.content} maxLength={200} className='w-full max-sm:h- mt-3 outline-none' rows="10" placeholder='Write a caption...' onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
                                        <p className=' absolute bottom-2 right-2 text-sm text-gray-400'>{form?.content.length}/200</p>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div > :
                null
            }
            <div className="absolute top-0 left-16 bg-white h-full z-20 mt-10 transition-all duration-300 ease-linear overflow-hidden overflow-y-scroll max-sm:left-0 max-w-lg " style={{ width: searchToggle === "" ? "0" : "100%", paddingLeft: searchToggle === "" ? "0" : "15px" }}>
                {searchToggle === "search" ?
                    <>
                        <p className='font-extrabold text-4xl my-10'>Search</p>
                        <div>
                            <input className="flex-1 border rounded-full py-2 w-full mr-5 px-4 focus:outline-none sm-max:px-5" type="text" placeholder="Search" value={searchValue} onChange={((e) => { handleSerach(e) })} style={{ padding: "5px 10px" }} />
                        </div>
                        <hr className='my-4' />
                        <div>
                            {searchItem.map((user, index) => (
                                <div key={index} className='relative flex items-center justify-between mb-5' onClick={((e) => { handleUserProfile(e, user) })}>
                                    <span className='flex items-center gap-2'>
                                        <img src={user.avatar} alt="profile" className='w-8 h-8 rounded-full cursor-pointer' onClick={((e) => { handleUserProfile(e, user) })} />
                                        <span className='cursor-pointer' onClick={((e) => { handleUserProfile(e, user) })}>
                                            <p className="text-lg">{user.username}</p>
                                            {/* <p className="text-xs">{user.Bio}</p> */}
                                        </span>
                                    </span>
                                    {onlineUser.find((onlineu => onlineu._id == user._id)) ? <p className='w-2 h-2 rounded-full absolute top-5 right-3 bg-green-600' ></p> : null}
                                </div>
                            ))}
                        </div>
                    </> : searchToggle === "notification" ?
                        <div className='flex flex-col gap-4 p-3'>
                            <span className='flex items-center gap-2 mt-3'>
                                <span className='font-extrabold text-xl '>Notification</span>
                                <p className='flex items-center justify-center p-3 w-5 h-5 bg-red-500 text-white rounded-full'>{notificatiionCount}</p>
                            </span>

                            <div className='flex-1 overflow-y-scroll'>
                                {notification?.map((item, index) => (
                                    <div key={index}
                                        className='flex items-center justify-between gap-5 my-2 py-3 px-8 rounded-xl cursor-pointer'
                                        style={{ backgroundColor: item?.notification?.viewBy.includes(data._id) ? "" : "#eaeaea" }}
                                        onClick={() => handleViewNotification(item?.notification?._id)}
                                    >
                                        <span className='flex items-center gap-3'>
                                            <img src={item?.fromUser?.avatar || profile} alt="profile" className='w-10 h-10 rounded-full' />
                                            <p className='text-sm'><strong>{item?.fromUser?.username || "Alston"}</strong>{item?.notification?.notificationDes}</p>
                                            <p className="text-sm font-semibold">
                                                {calculateTimeDifference(item?.notification?.createdAt)}..
                                            </p>
                                        </span>
                                        {/* <button className=' bg-gray-100 py-2 px-4 rounded-md'>Follow</button> */}
                                        <img src={item?.post?.fileUrl || profile} alt="profile" className='w-10 h-10 ' />
                                    </div>
                                ))}
                            </div>
                        </div> : null}
            </div>

            <div className='relative ml-10 max-sm:ml-0 max-sm:sticky max-sm:top-0 max-sm:flex max-sm:border-b-2 items-center justify-between bg-white max-sm:z-30'>

                <div className='flex items-center my-10 max-sm:my-2'>
                    <p className='font-extrabold text-4xl max-sm:ml-10' style={{ fontFamily: " 'Dancing Script', cursive" }} onClick={() => navigate('/')}>{searchToggle == "" ? "Alston" : "A"}</p>
                </div>
                <div className='flex flex-col gap-6 max-sm:hidden'>
                    <ul className="nav_link_container text-base list-none flex items-start flex-col gap-10">
                        <li>
                            {window.location.hash === '#/home' ? <Link onClick={handleRefresh}>
                                <span className="icon">
                                    <AiOutlineHome />
                                </span>
                                <p>Home</p>
                            </Link> :
                                <Link to='/home'>
                                    <span className="icon">
                                        <AiOutlineHome />
                                    </span>
                                    <p>Home</p>
                                </Link>
                            }
                        </li>
                        <li>
                            <Link to="#">
                                <span className="icon" onClick={() => setSearchToggle(searchToggle == "" || searchToggle == "notification" ? "search" : "")}>
                                    <CiSearch />
                                </span>
                                <p onClick={() => setSearchToggle(searchToggle == "" || searchToggle == "notification" ? "search" : "")}>Search</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="about">
                                <span className="icon">
                                    <BsChatLeft />
                                </span>
                                <p>About</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/home/reels">
                                <span className="icon" >
                                    <MdSlowMotionVideo />
                                </span>
                                <p>Reels</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="chat">
                                <span className="icon">
                                    <AiOutlineMessage />
                                </span>
                                <p>Messages</p>
                            </Link>
                        </li>
                        <li className='relative'>

                            <Link>
                                <span className="icon" onClick={() => setSearchToggle(searchToggle == "" || searchToggle == "search" ? "notification" : "")}>
                                    <AiOutlineHeart />
                                </span>
                                <p onClick={() => setSearchToggle(searchToggle == "" || searchToggle == "search" ? "notification" : "")}>Notifications</p>

                                {notificatiionCount > 0 ? <p className='flex items-center justify-center p-3 w-5 h-5 bg-red-500 text-white rounded-full'>{notificatiionCount}</p> : null}
                            </Link>
                        </li>
                        <li className='relative'>
                            <Link to="#"
                                onClick={() => setSToggle(true)}
                            >
                                <span className="icon">
                                    <BsPlusCircle />
                                </span>
                                <p>Create</p>
                            </Link>
                            {/* Users List */}
                            {usersList ?
                                <div className="absolute top-0 bg-yellow-500 h-56 w-80 overflow-scroll rounded-xl ">

                                    <div className='sticky top-0 bg-yellow-500 w-full p-5 pb-1' style={{ zIndex: 1 }} >
                                        <h3 className='text-center text-white rounded-2xl' style={{ width: "90%" }}>Users</h3>
                                        <p className='absolute top-1 right-3 cursor-pointer' style={{ zIndex: 2 }} onClick={() => setUsersList(false)} >&times;</p>
                                        <hr />
                                    </div>
                                    {user.map((data, index) => (
                                        <li className='flex items-center my-4 gap-2.5 no-underline text-black' key={index} onClick={((e) => { handleUserProfile(e, data) })} >
                                            <img className='w-9 h-9 rounded-full' src={data ? data.avatar : profile} />
                                            <span className="sidbarFrindName">Profile</span>
                                        </li>
                                    ))}
                                </div>
                                : null}
                        </li>
                    </ul>
                    {data ?
                        <div className="flex items-center justify-start gap-3" >
                            <img className='w-6 h-6 rounded-full cursor-pointer' src={data ? data.avatar : profile} onClick={((e) => { handleUserProfile(e, data) })} />
                            {/* <h4>{data && data.avatar ? data.username : "Alston"}</h4> */}
                            <h4 >Profile</h4>
                        </div> :
                        <div className="dropdown nav-item relative">
                            <button type="button" className="flex items-center justify-start gap-3" data-bs-toggle="dropdown"
                                onMouseEnter={(e) => setDropdownToggle(true)} onMouseLeave={(e) => setDropdownToggle(false)}
                            // onClick={(e) => setDropdownToggle(!dropdownToggle)}
                            >
                                <img className='w-6 h-6 rounded-full cursor-pointer' src={data ? data.avatar : profile} />
                                <h4 >Profile</h4>
                            </button>
                            <ul className="flex flex-col items-center justify-center absolute -top-20 -left-2 transition-all duration-300 ease-linear bg-gray-100 overflow-hidden z-40 rounded-xl w-32"
                                style={{ height: dropdownToggle ? "80px" : "0", padding: dropdownToggle ? "15px" : 0 }}
                                onMouseEnter={(e) => setDropdownToggle(true)} onMouseLeave={(e) => setDropdownToggle(false)}
                            >
                                <li><Link className="dropdown-item"
                                    onClick={() => setLoginForm("signup")}
                                //  to="/form/signup"
                                >Register</Link></li>
                                <li><Link className="dropdown-item"
                                    onClick={() => setLoginForm("login")}
                                //  to="/form/signin"
                                >Sign in</Link></li>
                            </ul>
                        </div>}



                    <hr />
                    <ul className="nav_link_container text-base font-extralight list-none flex items-start flex-col gap-10">
                        <li><Link>More</Link></li>
                    </ul>
                </div>
                <div className='sm:hidden'>
                    <ul className="nav_link_container text-base list-none flex items-start flex-col max-sm:flex-row gap-10 max-sm:gap-5 max-sm:mr-10 ">
                        <li>
                            <Link to="#">
                                <span className="icon relative" onClick={() => {
                                    if (data) {
                                        return
                                    }
                                }}>
                                    <span onClick={() => setSearchToggle(searchToggle == "" || searchToggle == "search" ? "notification" : "")}>
                                        <AiOutlineHeart />
                                        {notificatiionCount > 0 ? <p className='absolute -top-2 -left-2 flex items-center justify-center p-2 w-1 h-1 bg-red-500 text-white rounded-full'>{notificatiionCount}</p> : null}
                                    </span>
                                </span>
                            </Link>
                        </li>
                        <li className='relative'>
                            <Link to="#">
                                <span className="icon" onClick={() => {
                                    if (data) {
                                        setSToggle(true);
                                        setCurrentStep(0)
                                    } else {
                                        toast.warning("User not Login");
                                    }
                                }}>
                                    <BsPlusCircle />
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div >
            {/* fotter for  max-width 620px */}
            <div className='max-sm:block hidden fixed bottom-0 text-center bg-white w-full py-3 border-t-2 z-30' >
                <ul className="nav_link_container text-base list-none flex items-center justify-around ">
                    <li>
                        {window.location.hash === '#/home' ?
                            <Link onClick={handleRefresh}>
                                <span className="icon" style={{ fontSize: '1.3em' }}>
                                    <AiOutlineHome />
                                </span>
                            </Link> :
                            <Link to='/home'>
                                <span className="icon" style={{ fontSize: '1.3em' }}>
                                    <AiOutlineHome />
                                </span>
                            </Link>
                        }

                    </li>
                    <li>
                        <Link to="#">
                            <span className="icon" style={{ fontSize: '1.3em' }} onClick={() => setSearchToggle(searchToggle == "" || searchToggle == "notification" ? "search" : "")}>
                                <CiSearch />
                            </span>

                        </Link>
                    </li>
                    <li>
                        <Link to="/home/reels">
                            <span className="icon" style={{ fontSize: '1.3em' }}>
                                <MdSlowMotionVideo />
                            </span>

                        </Link>
                    </li>
                    <li>
                        <Link to="chat">
                            <span className="icon" style={{ fontSize: '1.3em' }}>
                                <AiOutlineMessage onClick={() => {
                                    if (data) {
                                        return
                                    }
                                    toast.success("Coming soon")
                                }}
                                />
                            </span>
                        </Link>
                    </li>
                    {data ?
                        <li className='flex items-center justify-start gap-3'>
                            <img className='w-6 h-6 rounded-full cursor-pointer' src={data ? data.avatar : profile} onClick={((e) => { handleUserProfile(e, data) })} />
                        </li> :
                        <div className="dropdown nav-item">
                            <button type="button" className="flex items-center justify-start gap-3" data-bs-toggle="dropdown" onClick={() => setDropdownToggle(!dropdownToggle)}>
                                <img className='w-6 h-6 rounded-full cursor-pointer' src={data ? data.avatar : profile} />
                            </button>
                            <ul className="flex flex-col items-center justify-center absolute -top-24 right-0 transition-all duration-300 ease-linear bg-gray-100 overflow-hidden z-40 rounded-xl" style={{ height: dropdownToggle ? "80px" : "0", padding: dropdownToggle ? "10px" : 0 }} onClick={() => setDropdownToggle(!dropdownToggle)}>
                                <li><Link className="dropdown-item" onClick={() => setLoginForm("signup")}>Register</Link></li>
                                <hr />
                                <li><Link className="dropdown-item" onClick={() => setLoginForm("login")}>Sign in</Link></li>
                            </ul>
                        </div>}

                </ul>
            </div >
        </>
    );
}