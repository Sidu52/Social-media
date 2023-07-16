import './Profile.scss';
import profile from '../../assets/image/profile.png'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineDataSaverOn } from 'react-icons/md';
import Navbar from "../../components/navbar/Navbar";
// import UserPost from '../../components/Post/UserPost';
// import UserReels from '../../components/Post/UserReels';
// import UserSave from '../../components/Post/UserSave';
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addtopost, addtoreel, savePost } from '../../store/Store'


export default function Profile() {
    const post = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    const [avatar, setAvatar] = useState("");
    // const [post, setPosts] = useState([]);

    const data = localStorage.getItem('Data');
    let parsedData;
    if (data) {
        parsedData = JSON.parse(data);
    } else {
        console.log('No data found in localStorage.');
    }
    useEffect(() => {
        if (parsedData) {
            axios.post('http://localhost:9000/getpostbyID', { Id: parsedData._id })

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
        formData.append('user', parsedData._id);

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
    // const postUser = users.find(user => user._id == parsedData._id)
    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="user">
                    <div className="img_profile">
                        {/* <img src={avatar || profile} alt="proile" className="" /> */}
                        <img src={parsedData && parsedData.avatar ? parsedData.avatar : profile} className="img-circle img-fluid" alt="Profile" />
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
                        <h2>{parsedData ? parsedData.username : "Alston"} <button type="button">Follow</button></h2>
                        <p>Bio</p>
                        <ul>
                            <li><strong>{post.length}</strong> posts</li>
                            <li><strong>167k</strong> followers</li>
                            <li><strong>28</strong> following</li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className='row_data'>
                    <span><Link to="/profile/post">Post</Link></span>
                    <span><Link to="/profile/reel">Real</Link></span>
                    <span><Link to="/profile/save">Saved</Link></span>
                    <span><Link to="/profile/tag">Taged</Link></span>
                </div>
                <Outlet />

            </div>
        </div>
    );
}
