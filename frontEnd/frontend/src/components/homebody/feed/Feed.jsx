import { useEffect, useState } from 'react';
import './Feed.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import { FaRegThumbsUp } from 'react-icons/fa';
import { AiOutlinePlusCircle, AiOutlineComment, AiTwotoneSave, AiOutlineCloudDownload } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/Store'
import { toast } from 'react-toastify';
import profile from '../../../assets/image/profile.png';
import Comment from './comment/Comment';

export default function Feed() {
    const navigate = useNavigate();
    // State variables
    const [form, setForm] = useState({ content: '', imgurl: '' });
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0);
    const [click, setClick] = useState(true);
    const [commentBoxIndex, setCommentBoxIndex] = useState(null);

    // Redux dispatch hook
    const dispatch = useDispatch();
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
            return 'Just now';
        }
    };

    // Fetch data from the server on component mount and whenever refreshCount changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (data) {
                    response = await axios.get(`http://localhost:9000?id=${data._id}`);
                } else {
                    response = await axios.get(`http://localhost:9000`);
                }
                setPosts(response.data.data);
                setUsers(response.data.user);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [refreshCount]);


    // Function to handle form submission and create a new post
    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('content', form.content);
        formData.append('img', form.imgurl);
        formData.append('user', data._id);
        setForm({ content: '', imgurl: '' });

        try {
            dispatch(setLoading(true));
            const response = await axios.post('http://localhost:9000/createpost', formData);
            if (response.data) {
                toast.success(response.data.message);
            }
            // Add the new post to the posts state
            setPosts([...posts, { content: response.data.content, fileUrl: response.data.fileUrl }]);
            dispatch(setLoading(false));
            // Increment the refresh count to trigger the useEffect and fetch the updated posts
            setRefreshCount(refreshCount + 1);
        } catch (error) {
            console.log('fail', error);
            // Handle error cases if the post creation fails
        }
    };

    // Function to save a post on the profile
    const handleSave = async (id) => {
        if (data) {
            const response = await axios.post('http://localhost:9000/savepost', {
                id: id
            });
            if (response.data) {
                toast.success(response.data.message);
            }
        }
    }

    // Function to handle post like
    const handleLike = async (id) => {
        try {
            setClick(false)
            if (click) {
                const response = await axios.post(`http://localhost:9000/toggle/like?id=${id}&type=Post&userid=${data._id}`);
                if (response.data) {
                    // Find the post in the posts state and update its like count
                    const updatedPosts = posts.map(post => {
                        if (post._id === id) {
                            return {
                                ...post,
                                likes: response.data.likes
                            };
                        }
                        return post;
                    });
                    setClick(true)
                    setPosts(updatedPosts);
                }
            }

        } catch (error) {
            console.log('fail', error);
        }
    }
    // Function to receive data from the child component (Comment)
    const handleDataFromChild = (data) => {
        setDataFromChild(data);
    };

    // Function to handle profile click and redirect to the profile page
    const handleProfileClick = (e, data) => {
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
        <div className="post__container">
            <form className="create-post" onSubmit={handleSubmit}>
                <div className="profile__photo" >
                    <img src={data ? data.avatar : profile} className="feed__profile" alt="Profile" onClick={((e) => handleProfileClick(e, data))} />
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
            </form>

            {/* Feed */}
            {posts && posts.map((post, index) => {
                const postUser = users.find(user => user._id == post.user);//Find for which user upload post 
                const userLikedPost = post.likes && data && post.likes.some(like => like.user === data.id);//Find for user exist or not inside post like array
                return (
                    <daiv className="feed" key={index}>
                        <div className="feed__head">
                            <div className="head__detail" onClick={((e) => handleProfileClick(e, postUser))}>
                                <img src={postUser?.avatar ? postUser.avatar : profile} className="feed__profile" alt="Profile" />
                                <h3>{postUser?.username}</h3>
                            </div>
                            <span style={{ margin: '5px', fontWeight: "500" }}>Create:-{calculateTimeDifference(post.createdAt)}</span>
                            <p style={{ margin: '5px' }}>{post.content}</p>
                        </div>
                        <div className="feed__img">
                            {post.fileUrl &&
                                ((post.fileType === 'png' ||
                                    post.fileType === 'jpg' ||
                                    post.fileType === 'jpeg' ||
                                    post.fileType === 'gif' ||
                                    post.fileType === 'webp' ||
                                    post.fileType === 'jfif') ? (
                                    <img src={post.fileUrl} alt="Feed" />
                                ) : post.fileType === 'mp4' ||
                                    post.fileType === 'avi' ||
                                    post.fileType === 'mov' ||
                                    post.fileType === 'wmv' ? (
                                    <video src={post.fileUrl} alt="Feed" loop controls />
                                ) : null)}
                        </div>

                        <div className="feed__icon">
                            <div className='like__box'>

                                <span className='like' onClick={() => handleLike(post._id)}><FaRegThumbsUp style={{ color: userLikedPost ? "#6666ff" : "", animation: post.likes && post.likes.length > 0 ? "splash 0.6s linear" : "" }} />
                                </span>
                                <AiOutlineComment onClick={() => setCommentBoxIndex(index)} />
                                {commentBoxIndex === index && <Comment
                                    post={post}
                                    users={users}
                                    localuser={data}
                                    sendDataToParent={handleDataFromChild}
                                />}
                                <div style={{ display: commentBoxIndex != null ? "flex" : "none" }} className='comment__cross' onClick={(e) => { setCommentBoxIndex(null) }}>
                                    {<RxCross1 />}
                                </div>

                            </div>
                            <div className='like__box'>
                                {post.fileUrl ? <AiOutlineCloudDownload /> : ''}
                                <AiTwotoneSave onClick={() => handleSave(post._id)} />
                            </div>
                        </div>
                        <span>{post.likes ? post.likes.length : "0"} likes and {post.comments ? post.comments.length : "0"} comments</span>
                    </daiv>
                );
            })}
        </div>
    );
}
