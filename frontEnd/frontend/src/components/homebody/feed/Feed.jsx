import { useEffect, useState, useContext } from "react";
import "./Feed.scss";
import axios from "axios";
import { MyContext } from "../../../Context/Mycontext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/Store";
import { toast } from "react-toastify";
import profile from "../../../assets/image/profile.png";
import Comment from "./comment/Comment";
import { AiOutlinePlusCircle } from 'react-icons/ai';

export default function Feed() {
    const navigate = useNavigate();
    const { URL, posts, setPosts, socket } = useContext(MyContext);
    // State variables
    const [form, setForm] = useState({ content: "", imgurl: "" });
    const [users, setUsers] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0);
    const [videoAutoPlay, setVideoAutoPlay] = useState([]);
    const [likeCount, setLikeCount] = useState([]);
    const [liked, setLiked] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [postMenuToggle, setPostMenuToggle] = useState(false);
    const [commentBoxIndex, setCommentBoxIndex] = useState(null);
    const [localUserLike, setLocalUserLike] = useState([]);
    const [localpost, setLocalPost] = useState([]);

    // Redux dispatch hook
    const dispatch = useDispatch();
    const data = JSON.parse(localStorage.getItem("Data"));
    // const userData = JSON.parse(localStorage.getItem('userData'));

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

    // Fetch data from the server on component mount and whenever refreshCount changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (data) {
                    response = await axios.get(`${URL}?id=${data._id}`);
                } else {
                    response = await axios.get(URL);
                }
                setLocalUserLike(response.data.like);
                setPosts(response.data.data);
                setUsers(response.data.user);
                const updatedLikeCounts = response.data.data.map(
                    (item) => item.likes.length
                );
                setLikeCount(updatedLikeCounts);
                // Update liked state
                const updatedLiked = response.data.data.map((post) => {
                    return (
                        data &&
                        response.data.like?.some((like) => like.likeable === post._id)
                    );
                });
                setLiked(updatedLiked);
                const autoplay = posts.filter(post => {
                    return (
                        post.fileType === "mp4" ||
                        post.fileType === "avi" ||
                        post.fileType === "mov" ||
                        post.fileType === "wmv"
                    )
                });
                const temp = autoplay.map(() => { return false })
                setVideoAutoPlay(temp)
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []); // Ensure proper dependencies are included in the dependency array

    // Function to handle form submission and create a new post
    const handleSubmit = async (e) => {
        if (!data) {
            toast.warning("User not found")
        }
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", form.content);
        formData.append("img", form.imgurl);
        formData.append("user", data._id);
        setForm({ content: "", imgurl: "" });
        // setPosts(...posts, formData)
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${URL}/createpost`, formData);
            if (response.data) {
                toast.success(response.data.message);
            }
            // Add the new post to the posts state
            console.log(data, response.data.data)
            socket?.emit("postUpload", {
                senderuserID: data?._id,
                reciveruserID: data?.following,
                notificationDes: `${data.username} upload a post ${calculateTimeDifference(response.data.data.createdAt)}`,
                postID: response.data.data._id,
                notificationType: "Project",
                viewBy: []
            })
            setPosts([response.data.data, ...posts]);
            dispatch(setLoading(false));
            // Increment the refresh count to trigger the useEffect and fetch the updated posts
            setRefreshCount(refreshCount + 1);
        } catch (error) {
            console.log("fail", error);
            // Handle error cases if the post creation fails
        }
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

    // Function to handle post like
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

            if (response.data) {
                // Find the post in the posts state and update its like count
                const updatedPosts = posts.map((post) => {
                    if (post.id === post.id) {
                        return {
                            ...post,
                            likes: response.data.likes,
                        };
                    }
                    return post;
                });
                if (response.data.data === "deleted") {
                    // Filter out the like to be deleted from localUserLike
                    const updatedUserLike = localUserLike.filter(
                        (like) => like.id !== response.data.like_id
                    );
                    setLocalUserLike(updatedUserLike);
                } else {
                    // Use setLocalUserLike with the updated localUserLike array
                    setLocalUserLike([...localUserLike, response.data.likes]);
                }
                // Remove setClick(true) as it's not needed here
                setPosts(updatedPosts);
            }
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

    // Function to receive data from the child component (Comment)
    const handleDataFromChild = (data) => {
        setDataFromChild(data);
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
    const handleDeltePost = async (e, post) => {
        e.preventDefault();
        try {
            const findPost = posts.filter(postdata => postdata._id != post._id)
            setPostMenuToggle(false);
            // Add the new post to the posts state
            setPosts(findPost);

            const response = await axios.post(`${URL}/deltepost`, { PostID: post._id });
            if (response.data) {
                toast.success(response.data.message);
            }
            dispatch(setLoading(false));
            // // Increment the refresh count to trigger the useEffect and fetch the updated posts
            // setRefreshCount(refreshCount + 1);

        } catch (err) {
            console.log("Error")
        }
    }
    const handleUpdatePost = async (e, post, data) => {
        e.preventDefault();
        try {
            const findPost = posts.filter(postdata => postdata._id != post._id)
            setPostMenuToggle(false);
            // Add the new post to the posts state
            setPosts(findPost);

            const response = await axios.post(`${URL}/deltepost`, { PostID: post._id });
            if (response.data) {
                toast.success(response.data.message);
            }
            dispatch(setLoading(false));
            // // Increment the refresh count to trigger the useEffect and fetch the updated posts
            // setRefreshCount(refreshCount + 1);

        } catch (err) {
            console.log("Error")
        }
    }

    const handleMenuClick = (e, data) => {
        setPostMenuToggle(true)
        setLocalPost(data);
    }
    return (
        <div className="h-full overflow-y-scroll flex flex-col items-center justify-items-start">
            {postMenuToggle ?
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    {/* <MdClose className='absolute top-0 max-sm:top-16 right-2 bg-gray-100 rounded-full text-4xl' onClick={() => setPostMenuToggle(false)} /> */}
                    <div className=" w-52 h-fit bg-white rounded-lg">
                        <ul className=' text-center'>
                            {data && data?._id === localpost.user ?
                                <>
                                    <li className='py-2 cursor-pointer' onClick={() => toast.success("Coming Soon")} >edit</li>
                                    <hr />
                                    <li className='py-2 cursor-pointer' onClick={(e) => handleDeltePost(e, localpost)}>delete</li>

                                </>
                                : null}
                            <hr />
                            <li className='py-2 cursor-pointer' onClick={() => handleSave(localpost._id)}>save</li>
                            <hr />
                            <li className='py-2 cursor-pointer' onClick={() => toast.success("Coming Soon")}>share</li>
                            <hr />
                            <li className='py-2' onClick={() => setPostMenuToggle(false)} >Close</li>
                        </ul>
                    </div>
                </div> : null}
            <form className="create-post w-3/4 max-[400px]:w-[90%]" onSubmit={handleSubmit}>
                <div className="profile__photo" >
                    <img src={data ? data.avatar : profile} className="feed__profile w-9 h-9 rounded-full" alt="Profile" onClick={((e) => handleProfileClick(e, data))} />
                    <div>
                        <label className="custom__file_upload">
                            <AiOutlinePlusCircle />
                            <input
                                type="file"
                                encType="multipart/form-data"
                                onChange={e => setForm({ ...form, imgurl: e.target.files[0] })}
                                id="file"
                            />
                        </label>
                        <input
                            type="text"
                            name="contain"
                            placeholder="What's on your mind, Alston?"
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                        />
                        <button type="submit" value="Update" className="btn btn-primary">
                            Post
                        </button>
                    </div>
                </div>
                <span style={{ padding: '0 50px' }}>{form.imgurl ? form.imgurl.name : ''}</span>
                <hr className="mt-2" />
            </form>
            <div className="max-sm:mb-20 flex items-center flex-col">
                {posts?.map((post, index) => {
                    const postUser = users.find((user) => user._id == post.user); //Find for which user upload post
                    return (
                        <div key={index} className="w-3/4 max-[400px]:w-[90%]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center justify-between gap-2">
                                    <img
                                        src={postUser?.avatar ? postUser.avatar : profile}
                                        alt="Profile"
                                        onClick={(e) => handleProfileClick(e, postUser)}
                                        className="w-9 h-9 rounded-full"
                                    />
                                    <p className="text-lg font-semibold">{postUser?.username}</p>
                                    <p className="text-sm">
                                        Create:-{calculateTimeDifference(post.createdAt)}..
                                    </p>
                                </span>
                                <span onClick={(e) => handleMenuClick(e, post)}>...</span>
                            </div>
                            <div>
                                {post.fileUrl &&
                                    (post.fileType === "png" ||
                                        post.fileType === "jpg" ||
                                        post.fileType === "jpeg" ||
                                        post.fileType === "gif" ||
                                        post.fileType === "webp" ||
                                        post.fileType === "jfif" ? (
                                        <img
                                            src={post.fileUrl}
                                            alt="Feed"
                                            className="w-full h-96 rounded-lg"
                                        />
                                    ) : post.fileType === "mp4" ||
                                        post.fileType === "avi" ||
                                        post.fileType === "mov" ||
                                        post.fileType === "wmv" ? (
                                        <video
                                            id="videoAutoPlay"
                                            autoPlay={videoAutoPlay[index]}
                                            src={post.fileUrl}
                                            alt="Feed"
                                            className="w-full h-96 rounded-lg"
                                            loop
                                            controls
                                        />
                                    ) : null)}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 mt-2">
                                    <span>
                                        <label className="container relative block cursor-pointer text-2xl select-none transition duration-100 transform">
                                            <input
                                                type="checkbox"
                                                className="absolute opacity-0 cursor-pointer h-0 w-0"
                                            />
                                            <div
                                                key={index}
                                                className="checkmark top-0 left-0 h-8 w-8 transition duration-100 animate-like-effect"
                                            >
                                                <svg
                                                    onClick={() => handleLike(index, post)}
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
                                    </span>

                                    <span onClick={() => {
                                        setCommentBoxIndex(index);
                                        setToggle(true);
                                    }}>
                                        <svg
                                            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition duration-300 fill-slate-300"
                                            viewBox="0 0 512 512"
                                            height="1em"
                                        >
                                            <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path>
                                        </svg>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span>
                                        <label className="container relative block cursor-pointer text-2xl select-none transition duration-100 transform">
                                            <input
                                                type="checkbox"
                                                className="absolute opacity-0 cursor-pointer h-0 w-0"
                                            />
                                            <button
                                                className="btnCloud relative bg-transparent border-none"
                                                onClick={() => handleSave(post._id)}
                                            >
                                                <svg
                                                    className="text-gray-600"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="30"
                                                    height="30"
                                                    class="icon"
                                                >
                                                    <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                                </svg>
                                            </button>
                                        </label>
                                    </span>
                                </div>
                            </div>
                            <span className="text-sm">
                                {likeCount[index]} likes and{" "}
                                {post.comments ? post.comments.length : "0"} comments
                            </span>
                            <hr className="my-4" />
                            {toggle ? (
                                commentBoxIndex === index && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
                                        <p className='absolute top-1 right-3 cursor-pointer text-5xl text-white font-light' style={{ zIndex: 2 }} onClick={() => setToggle(false)} >&times;</p>
                                        <Comment
                                            post={post}
                                            users={users}
                                            localuser={data}
                                            sendDataToParent={handleDataFromChild}
                                            localUserLike={localUserLike}
                                        />
                                    </div>
                                )
                            ) : null}
                        </div>
                    );
                })}
            </div>


        </div>
    );
}