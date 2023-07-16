import { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlinePlusCircle, AiOutlineComment, AiTwotoneSave, AiOutlineCloudDownload } from 'react-icons/ai';
import { FaRegThumbsUp } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import './Feed.scss';
import { toast } from 'react-toastify';
import profile from '../../../assets/image/profile.png';
import Comment from './comment/Comment';

export default function Feed() {
    const [form, setForm] = useState({ content: '', imgurl: '' });
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0);
    const [click, setClick] = useState(true);
    const [commentBoxIndex, setCommentBoxIndex] = useState(null);


    const data = localStorage.getItem('Data');
    let parsedData;
    if (data) {
        parsedData = JSON.parse(data);
    } else {
        console.log('No data found in localStorage.');
    }

    useEffect(() => {
        axios
            .get('http://localhost:9000')
            .then(response => {
                console.log(response.data.likes)
                setPosts(response.data.data);
                setUsers(response.data.user);
            })
            .catch(error => {
                console.log(error);
            });
    }, [refreshCount]);

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('content', form.content);
        formData.append('img', form.imgurl);
        formData.append('user', parsedData._id);
        setForm({ content: '', imgurl: '' });

        try {
            toast.warn('Loading');
            const response = await axios.post('http://localhost:9000/createpost', formData);
            if (response.data) {
                toast.success(response.data.message);
            }

            // Add the new post to the posts state
            setPosts([...posts, { content: response.data.content, fileUrl: response.data.fileUrl }]);

            // Increment the refresh count to trigger the useEffect and fetch the updated posts
            setRefreshCount(refreshCount + 1);

            // Reset form fields or perform any necessary actions upon successful post creation
        } catch (error) {
            console.log('fail', error);
            // Handle error cases if the post creation fails
        }
    };

    //Save Post
    const handleSave = async (id) => {
        if (parsedData) {
            const response = await axios.post('http://localhost:9000/savepost', {
                id: id
            });
            if (response.data) {
                toast.success(response.data.message);
            }


        }

    }
    const handleLike = async (id) => {
        try {
            setClick(false)
            if (click) {
                const response = await axios.post(`http://localhost:9000/toggle/like?id=${id}&type=Post&userid=${parsedData._id}`);
                if (response.data) {
                    // Find the post in the posts state and update its like count
                    const updatedPosts = posts.map(post => {
                        if (post._id === id) {
                            return {
                                ...post,
                                likes: response.data.likes // Assuming the API response includes the updated like count
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
    //Take data from Chil comment component
    const handleDataFromChild = (data) => {
        setDataFromChild(data);
    };


    return (
        <div className="post__container">
            <form className="create-post" onSubmit={handleSubmit}>
                <div className="profile__photo">
                    <img src={parsedData ? parsedData.avatar : profile} className="feed__profile" alt="Profile" />

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
            {posts.map((post, index) => {
                const postUser = users.find(user => user._id == post.user);
                return (
                    <div className="feed" key={index}>
                        <div className="feed__head">
                            <div className="head__detail">
                                <img src={postUser?.avatar ? postUser.avatar : profile} className="feed__profile" alt="Profile" />
                                <h3>{postUser?.username}</h3>
                            </div>
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
                                <span className='like' onClick={() => handleLike(post._id)}><FaRegThumbsUp style={{ color: post.likes && post.likes.length <= 0 ? "" : "#6666ff", animation: post.likes && post.likes.length > 0 ? "splash 0.6s linear" : "" }} />
                                </span>
                                <AiOutlineComment onClick={() => setCommentBoxIndex(index)} />
                                {commentBoxIndex === index && <Comment
                                    post={post}
                                    users={users}
                                    localuser={parsedData}
                                    sendDataToParent={handleDataFromChild}
                                />}
                                <div className='comment__cross' onClick={(e) => { setCommentBoxIndex(null) }}>
                                    {commentBoxIndex === index && <RxCross1 />}
                                </div>

                            </div>
                            <div>
                                {post.fileUrl ? <AiOutlineCloudDownload /> : ''}
                                <AiTwotoneSave onClick={() => handleSave(post._id)} />
                            </div>
                        </div>
                        <span>{post.likes ? post.likes.length : "0"} likes and {post.comments ? post.comments.length : "0"} comments</span>
                    </div>
                );
            })}
        </div>
    );
}
