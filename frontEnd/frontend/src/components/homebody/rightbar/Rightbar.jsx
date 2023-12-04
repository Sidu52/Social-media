import { useEffect, useContext, useState } from 'react';
import './Rightbar.scss'
import axios from 'axios';
import { MyContext } from '../../../Context/Mycontext';
import profile from '../../../assets/image/profile.png'
import { Link, useNavigate } from 'react-router-dom';
export default function Rightbar() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const { onlineUser, URL } = useContext(MyContext);
    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));
    // Fetch user data from the server using Axios
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(`${URL}/user`);
                setUsers(data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [onlineUser]);

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

    return (
        <div className='max-lg:hidden'>
            <div className='flex items-center justify-between mt-10'>
                <div className='flex items-center gap-2'>
                    <img src={data ? data.avatar : profile} alt="Profile" className='w-9 h-9 rounded-full' />
                    <span>
                        <p>{data?.username || "Alston"}</p>
                        {/* <p>{data?.content}</p> */}
                    </span>
                </div >
                <div>See All</div>
            </div>
            <hr className='my-3' />
            <div>
                <p className='text-center text-gray-500 font-black'>Online Users</p>
                <div className=' h-80 overflow-hidden overflow-y-scroll'>
                    {users?.map((userdata, index) => (
                        <div className='flex items-center justify-between my-4' key={index}>
                            <span className="flex item-center gap-2"  >
                                <img src={userdata?.avatar ? userdata?.avatar : profile} alt="Profile" className='w-9 h-9 rounded-full cursor-pointer' onClick={((e) => { handleUserProfile(e, userdata) })} />
                                <p className=' cursor-pointer' onClick={((e) => { handleUserProfile(e, userdata) })}>{userdata?.username || "Alston"}</p>
                                <p >{userdata.content}</p>
                            </span>
                            {onlineUser.find((user => user._id == userdata._id)) ? <span className='bg-lime-400 w-2 h-2 rounded-full'></span> : null}

                        </div>
                    ))}
                </div>
            </div>

            <ul className='flex flex-wrap items-center gap-1 text-gray-300 list-disc mt-3'>
                <li className='font-thin text-xs'><Link to="about">About</Link></li>
                <li className='font-thin text-xs'>Press</li>
                <li className='font-thin text-xs'>API</li>
                <li className='font-thin text-xs'>Jobs</li>
                <li className='font-thin text-xs'>Privacy</li>
                <li className='font-thin text-xs'>Terms</li>
                <li className='font-thin text-xs'>Locations</li>
                <li className='font-thin text-xs'>Language</li>
            </ul>
            <span className='font-thin text-xs text-gray-300'>© 2023 SIDHU ALSTON</span>
        </div >
        // <div className='rightbar'>
        //     <div className="rightWrapper">
        //         <div className="birthdayContainer">
        //             <img className='birthdayImg' src="https://images.unsplash.com/photo-1496458590512-56d2688442b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="bithday img" />
        //             <span className="birthdayText"> <b>Alex</b> and <b>3 other frinds</b> have a birthday..</span>
        //         </div>
        //         <iframe className='rightbarAd' src="https://www.youtube.com/embed/n3oo9U2etqM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        //         <h4 className="rightbarTitle">Online Friends</h4>
        //         <ul className="rightbarFriendList">
        //             <FriendList />
        //         </ul>
        //     </div>
        // </div>
    )
}
