import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reels.scss';
import { FaPlay } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import Profile from '../profile/Profile';
import { MyContext } from '../../Context/Mycontext';
import { toast } from 'react-toastify';
import { IoMdShare } from "react-icons/io";
import { HiSave } from "react-icons/hi";
import cdImage from '../../assets/image/cdImage.png'

const Reels = () => {
    const [reels, setReels] = useState([]);
    const [liked, setLiked] = useState([]);
    const [likeCount, setLikeCount] = useState([]);
    const [active, setActive] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRefs = useRef([]);
    // const { URL, users } = useContext(MyContext);
    const data = JSON.parse(localStorage.getItem('Data'));



    const navigate = useNavigate();
    const { URL, users } = useContext(MyContext);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URL}/reels`);
                if (response.data.data) {
                    // Fix typo here
                    videoRefs.current = response.data.data.map(() => React.createRef());
                    setReels(response.data.data);

                    console.log(response.data.data); // Logging retrieved data
                    const updatedLiked = response.data.data.map((post) => {
                        if (response.data && post.like?.some((like) => like.likeable === post._id)) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    setLiked(updatedLiked);
                    const updatedLikeCounts = response.data.data.map(
                        (item) => item.likes.length
                    );
                    setLikeCount(updatedLikeCounts);
                } else {
                    console.log("Data not found");
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (videoRefs.current[active] && videoRefs.current[active].current) {
            if (isPlaying) {
                videoRefs.current[active].current.play();
            } else {
                videoRefs.current[active].current.pause();
            }
        }
    }, [isPlaying, active]);

    const toggleVideoPlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleScroll = debounce((e) => {
        const delta = Math.sign(e.deltaY);
        if (delta === -1) {
            goPrev();
        } else if (delta === 1) {
            goNext();
        }
    }, 200);

    let touchStartY = null;
    let touchEndY = null;
    const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = debounce((e) => {
        if (touchStartY === null) {
            return;
        }
        touchEndY = e.touches[0].clientY;
        const touchDiff = touchEndY - touchStartY;

        if (touchDiff > 0) {
            goNext();
        } else if (touchDiff < 0) {
            goPrev();
        }
        touchStartY = null;
        touchEndY = null;
    }, 200);


    const goPrev = () => {
        setIsPlaying(false); // Pause current video
        videoRefs.current[active].current.pause(); // Explicitly pause the current video
        setActive((prevActive) => (prevActive === 0 ? reels.length - 1 : prevActive - 1));
        setIsPlaying(true); // Play previous video
        videoRefs.current[active === 0 ? reels.length - 1 : active - 1].current.play(); // Explicitly play the previous video
    };

    const goNext = () => {
        setIsPlaying(false); // Pause current video
        videoRefs.current[active].current.pause(); // Explicitly pause the current video
        setActive((prevActive) => (prevActive === reels.length - 1 ? 0 : prevActive + 1));
        setIsPlaying(true); // Play next video
        videoRefs.current[active === reels.length - 1 ? 0 : active + 1].current.play(); // Explicitly play the next video
    };






    // Function to save a post on the profile
    const handleSave = async (id) => {
        if (data) {
            const response = await axios.post(`${URL}/savepost`, {
                id: id,
            });
            if (response.data) {
                toast.success(response.data.message);
            }
        }
    };

    // // Function to handle post like
    const handleLike = async (index, post) => {
        try {

            const newLiked = [...liked];
            if (!newLiked[index]) {
                setLikeCount((prevCounts) => {
                    const updatedCounts = [...prevCounts];
                    updatedCounts[index]++;
                    return updatedCounts;
                });
            } else {
                setLikeCount((prevCounts) => {
                    const updatedCounts = [...prevCounts];
                    updatedCounts[index]--;
                    return updatedCounts;
                });
            }
            newLiked[index] = !newLiked[index];
            setLiked(newLiked);
            // Remove setClick(false) and if (click) condition, as it's not necessary
            const response = await axios.post(
                `${URL}/toggle/like?id=${post._id}&type=Post&userid=${data._id}`
            );
            socket.emit("notificationsend", {
                senderuserID: data?._id,
                reciveruserID: [post.user],
                notificationDes: ` ${response?.data?.data} liked your post `,
                postID: post,
                notificationType: "Post",
                viewBy: []
            });
        } catch (error) {
            console.log("fail", error);
        }
    };

    // Function to handle profile click and redirect to the profile page
    const handleProfileClick = (e, data) => {
        e.preventDefault();
        try {
            localStorage.setItem("userData", JSON.stringify(data));
            // Redirect to the profile page
            navigate("/profile/post");
        } catch (error) {
            console.log("fail", error);
        }
    };
    return (
        <div className="reels-container h-screen  max-sm:h-[80vh]"
            onWheel={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <div className="reels-wrapper">
                {reels.map((reel, index) => {
                    const postUser = users.find((user) => user._id == reel.user);
                    return (
                        <div key={index} className=' relative h-full'>

                            <video
                                onClick={toggleVideoPlay}
                                autoPlay={index === active}
                                loop={index === active}
                                className={`reel-video ${index === active ? 'active' : ''} rounded-lg h-full`}
                                src={reel.fileUrl}
                                ref={videoRefs.current[index]}
                            />
                            {index === active && (
                                <>
                                    <div className="absolute top-1/2 right-0 flex flex-col gap-4 z-20 mr-2">
                                        <span className=' flex flex-col items-center'>
                                            <label className="container relative block cursor-pointer text-2xl select-none transition duration-100 transform">
                                                <input
                                                    type="checkbox"
                                                    className="absolute opacity-0 cursor-pointer h-0 w-0"
                                                />
                                                <div className="checkmark top-0 left-0 h-8 w-8 transition duration-100 animate-like-effect">
                                                    <svg
                                                        onClick={() => handleLike(index, reel)}
                                                        viewBox="0 0 256 256"
                                                    >
                                                        <rect fill="none" height="256" width="256"></rect>
                                                        <path
                                                            style={{
                                                                fill: liked[index] ? "#FF5353" : "#3939392f",
                                                            }}
                                                            d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
                                                            stroke-width="20px"
                                                            stroke="#FFF"
                                                            fill="none"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </label>
                                            <span className=' text-white'> {likeCount[index]}</span>
                                        </span>

                                        <span onClick={() => {
                                            toast.success("coming soon")
                                        }}>
                                            <svg
                                                className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition duration-300 fill-slate-300"
                                                viewBox="0 0 512 512"
                                                height="1em"
                                            >
                                                <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path>
                                            </svg>
                                        </span>

                                        <span>

                                            <button
                                                className="relative bg-transparent border-none"
                                                onClick={() => toast.success("Coming Soon..")}
                                            >
                                                <IoMdShare className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition duration-300 fill-slate-300" />
                                            </button>

                                        </span>
                                        <span>
                                            <label className="container relative block cursor-pointer text-2xl select-none transition duration-100 transform">
                                                <input
                                                    type="checkbox"
                                                    className="absolute opacity-0 cursor-pointer h-0 w-0"
                                                />
                                                <button
                                                    className="btnCloud relative bg-transparent border-none"
                                                    onClick={() => handleSave(reel._id)}
                                                >
                                                    <HiSave className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition duration-300 fill-slate-300" />
                                                </button>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="absolute bottom-6 w-full bg-black text-white bg-opacity-20 p-4 rounded-lg shadow-md">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={postUser && postUser.avatar ? postUser.avatar : Profile}
                                                className="w-10 h-10 rounded-full cursor-pointer"
                                                onClick={e => handleProfileClick(e, data)}
                                                alt="User Avatar"
                                            />
                                            <h3
                                                onClick={e => handleProfileClick(e, data)}
                                                className="text-xl font-semibold cursor-pointer"
                                            >
                                                {postUser?.username}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2">{reel?.content}</p>

                                        <div className="flex items-center gap-3 mt-4">
                                            <div className=" rounded-full w-10 h-10 flex items-center justify-center">
                                                <img src={cdImage}  className={`w-10 h-10 ${isPlaying ? "animate-spin" : ""}`} alt="CD Image" />
                                            </div>
                                            <p className="text-xs text-gray-300">
                                                Unknown music by ({postUser?.username})
                                            </p>
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="absolute top-2/4 left-[47%] origin-center cursor-pointer text-white text-4xl" onClick={toggleVideoPlay}>
                {isPlaying ? null : <FaPlay />}
            </div>
        </div>
    );
};
export default Reels;