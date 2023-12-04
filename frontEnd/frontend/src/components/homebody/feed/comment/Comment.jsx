import { useEffect, useState, useContext } from "react";
import "./Comment.scss";
import axios from "axios";
import { MyContext } from "../../../../Context/Mycontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import profile from "../../../../assets/image/profile.png";
import EmojiPicker from 'emoji-picker-react';


export default function Comment({ post, users, localuser, localUserLike }) {
    const navigate = useNavigate();
    const { URL } = useContext(MyContext);
    const [commentinput, setCommentInput] = useState("");
    const [data, setData] = useState([]);
    const [comment, setComment] = useState([]);
    const [contactEdit, setContactEdit] = useState([]);
    const [likeCount, setLikeCount] = useState([]);
    const [liked, setLiked] = useState([]);
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };

    // Find the user who created the post
    const postUser = users.find((user) => user._id == post.user);

    // Fetch comments for the post from the backend when the component mounts or postUser changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${URL}/toggle?id=${post._id}`);
            setData(response.data.data);
            const commentsdata = response.data.data.map(
                (item) => item.content
            );

            setComment(commentsdata)
            const updateeditabledata = response.data.data.map(() => {
                return false;
            });
            setContactEdit(updateeditabledata);

            const updatedLikeCounts = response.data.data.map(
                (item) => item.likes.length
            );
            setLikeCount(updatedLikeCounts);
            // Update liked state
            const updatedLiked = response.data.data.map((post) => {
                console.log(localUserLike, post)
                return (
                    data &&
                    localUserLike?.some((like) => like.likeable === post._id)
                );
            });
            setLiked(updatedLiked);
        };
        fetchData();
    }, []);

    // Calculate time difference between current time and the time the comment was uploaded
    const calculateTimeDifference = (uploadTime) => {
        const currentTime = new Date();
        const uploadTimestamp = new Date(uploadTime);
        const timeDifference = currentTime.getTime() - uploadTimestamp.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return "Just now";
        }
    };



    // Handle adding a new comment to the post
    const handleComment = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(
                `${URL}/toggle/comment?id=${post._id}&userid=${localuser._id}&data=${commentinput}`
            );
            console.log(response.data.data)
            if (response.data) {
                setData((prevState) => [...prevState, response.data.data]);
            }
        } catch (error) {
            console.log("fail", error);
        }
    };

    // Handle liking a comment
    const handleLike = async (index, id) => {
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
            const response = await axios.post(
                `${URL}/toggle/like?id=${id}&type=Comment&userid=${localuser._id}`
            );
            if (response.data) {
                // Find the comment in the data state and update its like count
                const updatedData = data.map((comment) => {
                    if (comment._id === id) {
                        return {
                            ...comment,
                            likes: response.data.likes, // Assuming the API response includes the updated like count
                        };
                    }
                    return comment;
                });
                setData(updatedData);
            }
        } catch (error) {
            console.log("fail", error);
        }
    };
    // Handle editing a comment
    const handleEdit = async (e, id, editedContent) => {
        console.log("Enter")
        e.preventDefault();
        try {
            const response = await axios.put(
                `${URL}/toggle/comment?id=${id}&userid=${localuser._id}&data=${editedContent}`
            );
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            if (response.data) {
                const updatedData = data.map((comment) => {
                    if (comment._id === id) {
                        return {
                            ...comment,
                            content: editedContent,
                        };
                    }
                    return comment;
                });
                setData(updatedData);
                setContactEdit(false);
            }
        } catch (error) {
            console.log("Error editing comment:", error);
        }
    };
    //Handle Profile Page
    const handleUserProfile = async (e, data) => {
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
        <div className="flex w-4/5 h-4/5 bg-white">
            <div className="w-full h-full">
                {post.fileUrl &&
                    (post.fileType === "png" ||
                        post.fileType === "jpg" ||
                        post.fileType === "jpeg" ||
                        post.fileType === "gif" ||
                        post.fileType === "webp" ||
                        post.fileType === "jfif" ? (
                        <img src={post.fileUrl} alt="post" className='w-full h-full' />
                    ) : post.fileType === "mp4" ||
                        post.fileType === "avi" ||
                        post.fileType === "mov" ||
                        post.fileType === "wmv" ? (
                        <video src={post.fileUrl} alt="post" loop controls className='w-full h-full' />
                    ) : null)}
            </div>
            <div className=" relative w-full h-full bg-white p-3">
                <div className="flex items-center justify-between" >
                    <span className="flex items-center gap-2 w-full" onClick={((e) => { handleUserProfile(e, data) })}>
                        <img src={postUser?.avatar ? postUser.avatar : profile} alt="profile" className='w-9 h-9 rounded-full' />
                        <p className='text-lg font-semibold'>{postUser?.username}</p>
                    </span>
                    <span className="text-black text-lg font-semibold tracking-tight">...</span>
                </div>
                <hr className="m-3" />
                <div>
                    {data?.map((commentdata, index) => {
                        let CDATA = [...comment];
                        let CDATAVALUE = [...contactEdit];
                        const commentUser = users.find(user => user._id == commentdata.user);
                        return (
                            <div className="flex items-center justify-between">
                                <div key={index}>
                                    <span className="flex items-center gap-2">
                                        <img src={commentUser?.avatar || profile} alt="profile" className='w-9 h-9 rounded-full cursor-pointer' />
                                        <p className='text-lg font-semibold cursor-pointer'>{commentUser?.username}</p>
                                        <input
                                            className='text-sm border border-gray-300 p-1 outline-none border-none'
                                            value={comment[index]} // Set the value to the current content
                                            readOnly={!contactEdit[index]}
                                            onChange={(e) => {
                                                CDATA[index] = e.target.value;
                                                setComment(CDATA);
                                            }}
                                        />
                                    </span>
                                    <span className='text-sm flex items-center gap-2'>
                                        <p className="cursor-pointer">{calculateTimeDifference(commentdata.createdAt)}</p>
                                        <p className="cursor-pointer">{likeCount[index]} like</p>
                                        {!contactEdit[index] ?
                                            <span className="cursor-pointer" onClick={() => {
                                                CDATAVALUE[index] = true;
                                                setContactEdit(CDATAVALUE)
                                            }}>edit</span>
                                            :
                                            <span className="cursor-pointer" onClick={(e) => {
                                                CDATAVALUE[index] = false;
                                                setContactEdit(CDATAVALUE)
                                                handleEdit(e, commentdata._id, comment[index])
                                            }}>save</span>
                                        }

                                    </span>
                                </div>
                                <span>
                                    <label className="container relative block cursor-pointer text-2xl select-none transition duration-100 transform">
                                        <input
                                            type="checkbox"
                                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                                        />
                                        <div
                                            key={index}
                                            className="checkmark top-0 left-0 h-5 w-5 transition duration-100 animate-like-effect"
                                        >
                                            <svg
                                                // onClick={() => handleLike(index, post._id)}
                                                viewBox="0 0 256 256"
                                            >
                                                <rect fill="none" height="256" width="256"></rect>
                                                <path
                                                    style={{
                                                        fill: liked[index] ? "#FF5353" : "#3939392f",
                                                    }}
                                                    onClick={(() => { handleLike(index, commentdata._id) })}
                                                    d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
                                                    stroke-width="20px"
                                                    stroke="#FFF"
                                                    fill="none"
                                                ></path>
                                            </svg>
                                        </div>
                                    </label>
                                </span>
                            </div>
                        )
                    })}
                </div>

                <form className=" absolute bottom-0 items-center justify-between py-3" style={{ width: "92%" }} onSubmit={(e) => { handleComment(e) }} >
                    <hr />
                    <input
                        value={commentinput}
                        type="text"
                        required
                        placeholder="Add a comment"
                        className="outline-none w-5/6"
                        onChange={(e) => { setCommentInput(e.target.value) }}
                    />
                    <button>Post</button>
                </form>
            </div>

        </div >

        // <div className="comment__main_conatainer">
        //     <div className="comment__post">
        //         {post.fileUrl &&
        //             ((post.fileType === 'png' ||
        //                 post.fileType === 'jpg' ||
        //                 post.fileType === 'jpeg' ||
        //                 post.fileType === 'gif' ||
        //                 post.fileType === 'webp' ||
        //                 post.fileType === 'jfif') ? (
        //                 <img src={post.fileUrl} alt="post" />
        //             ) : post.fileType === 'mp4' ||
        //                 post.fileType === 'avi' ||
        //                 post.fileType === 'mov' ||
        //                 post.fileType === 'wmv' ? (
        //                 <video src={post.fileUrl} alt="post" loop controls />
        //             ) : null)}
        //     </div>
        //     <div className='comment__data'>
        //         <div className="comment__head" onClick={((e) => { handleUserProfile(e, data) })}>
        //             <img src={postUser?.avatar ? postUser.avatar : profile} alt="profile" />
        //             <p>{postUser?.username}</p>
        //         </div>

        //         <div style={{ overflow: "scroll", height: "78%", paddingBottom: "15%" }}>
        //             {data.map((datacomment, index) => {
        //                 const commentUser = users.find(user => user._id == datacomment.user);
        //                 return (
        //                     <div style={{ paddingBottom: "15px" }} key={index}>
        //                         <div className="comment__container">
        //                             <img src={commentUser?.avatar ? commentUser.avatar : profile} alt="profile" />
        //                             <p><strong>{commentUser?.username}</strong>
        //                                 {/* <span contentEditable={contactEdit}> {datacomment.content}</span> */}
        //                                 <span contentEditable={contactEdit} onBlur={(e) => handleEdit(e, datacomment._id, e.target.innerText)}>
        //                                     {datacomment.content}
        //                                 </span>
        //                             </p>
        //                         </div>
        //                         <div className="commentControl__buttons">
        //                             <span>{calculateTimeDifference(datacomment.createdAt)}</span>
        //                             <span onClick={(() => { handleLike(datacomment._id) })}>{datacomment.likes ? datacomment.likes.length : ""} Like</span>
        //                             <span onClick={(() => { setContactEdit(!contactEdit) })}>{contactEdit ? "save" : "edit"}</span>

        //                         </div>
        //                     </div>

        //                 )

        //             })}
        //         </div>

        //         <div className="comment__footer">
        //             <form onSubmit={(e) => { handleComment(e) }}>
        //                 <input type="text" value={comment} placeholder='Comment' onChange={(e) => { setComment(e.target.value) }} />
        //                 <button>Post</button>
        //             </form>
        //         </div>
        //     </div>
        // </div>
    );
}
