import React, { useEffect, useState } from 'react'
import './Comment.scss'
import axios from 'axios';
import { toast } from 'react-toastify';
import profile from '../../../../assets/image/profile.png';
export default function Comment({ post, users, localuser, sendDataToParent }) {
    const [comment, setComment] = useState("");
    const [data, setData] = useState([]);
    const [contactEdit, setContactEdit] = useState(false);
    const postUser = users.find(user => user._id == post.user);


    // Calculate Time
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
            return 'Just now';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:9000/toggle?id=${post._id}`);
            setData(response.data.data);
        };
        fetchData();
    }, [setData, , postUser]);

    const handleComment = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(`http://localhost:9000/toggle/comment?id=${post._id}&userid=${localuser._id}&data=${comment}`);
            if (response.data) {
                setData(prevState => [...prevState, response.data.data]);
            }
        } catch (error) {
            console.log('fail', error);
        }
    }

    //Handle Comment Like
    const handleLike = async (id) => {
        try {
            const response = await axios.post(`http://localhost:9000/toggle/like?id=${id}&type=Comment&userid=${localuser._id}`);
            // console.log(response.data)
            if (response.data) {
                // Find the comment in the data state and update its like count
                const updatedData = data.map(comment => {
                    if (comment._id === id) {
                        return {
                            ...comment,
                            likes: response.data.likes // Assuming the API response includes the updated like count
                        };
                    }
                    return comment;
                });
                setData(updatedData);
            }

        } catch (error) {
            console.log('fail', error);
        }
    }

    const handleEdit = async (e, id, editedContent) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:9000/toggle/comment?id=${id}&userid=${localuser._id}&data=${editedContent}`);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            if (response.data) {
                const updatedData = data.map(comment => {
                    if (comment._id === id) {
                        return {
                            ...comment,
                            content: editedContent
                        };
                    }
                    return comment;
                });
                setData(updatedData);
                setContactEdit(false);
            }
        } catch (error) {
            console.log('Error editing comment:', error);
        }

    }

    return (

        <div className="comment__main_conatainer">
            <div className="comment__post">
                {post.fileUrl &&
                    ((post.fileType === 'png' ||
                        post.fileType === 'jpg' ||
                        post.fileType === 'jpeg' ||
                        post.fileType === 'gif' ||
                        post.fileType === 'webp' ||
                        post.fileType === 'jfif') ? (
                        <img src={post.fileUrl} alt="post" />
                    ) : post.fileType === 'mp4' ||
                        post.fileType === 'avi' ||
                        post.fileType === 'mov' ||
                        post.fileType === 'wmv' ? (
                        <video src={post.fileUrl} alt="post" loop controls />
                    ) : null)}
            </div>
            <div className='comment__data'>
                <div className="comment__head">
                    <img src={postUser?.avatar ? postUser.avatar : profile} alt="profile" />
                    <p>{postUser?.username}</p>
                </div>

                <div style={{ overflow: "scroll", height: "78%", paddingBottom: "15%" }}>
                    {data.map((datacomment, index) => {
                        const commentUser = users.find(user => user._id == datacomment.user);
                        return (
                            <div style={{ paddingBottom: "15px" }} key={index}>
                                <div className="comment__container">
                                    <img src={commentUser?.avatar ? commentUser.avatar : profile} alt="profile" />
                                    <p><strong>{commentUser?.username}</strong>
                                        {/* <span contentEditable={contactEdit}> {datacomment.content}</span> */}
                                        <span contentEditable={contactEdit} onBlur={(e) => handleEdit(e, datacomment._id, e.target.innerText)}>
                                            {datacomment.content}
                                        </span>
                                    </p>
                                </div>
                                <div className="commentControl__buttons">
                                    <span>{calculateTimeDifference(datacomment.createdAt)}</span>
                                    <span onClick={(() => { handleLike(datacomment._id) })}>{datacomment.likes ? datacomment.likes.length : ""} Like</span>
                                    <span onClick={(() => { setContactEdit(!contactEdit) })}>{contactEdit ? "save" : "edit"}</span>

                                </div>
                            </div>

                        )

                    })}
                </div>



                <div className="comment__footer">
                    <form onSubmit={(e) => { handleComment(e) }}>
                        <input type="text" value={comment} placeholder='Comment' onChange={(e) => { setComment(e.target.value) }} />
                        <button>Post</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
