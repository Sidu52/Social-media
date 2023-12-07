import React from 'react'
import axios from 'axios';
import { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../Context/Mycontext';
import profile from '../../assets/image/profile.png';
import { MdAttachFile } from "react-icons/md"
import './ChatPage.scss';
import { toast } from "react-toastify";
import { IoSearchOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {

    // Retrieve the ID parameter from the URL
    const { id } = useParams();
    const navigate = useNavigate();
    const localuser = JSON.parse(localStorage.getItem('Data'));
    const userData = JSON.parse(localStorage.getItem('userData'));
    // Get user data from local storage
    const { URL, socket, onlineUser, chatWindow, setChatWindow } = useContext(MyContext);
    const [reciverUser, setRecieverUser] = useState({});
    const [conversation, setConverstaion] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [searchValue, setSearchValue] = useState("");// To hold the value of the search input
    const [searchItem, setSearchItem] = useState(conversation); // To store the search results


    //Get messages acording conversionId for room
    const handlemessageClick = async (conversationId, user) => {
        try {
            if (!conversationId) {
                setRecieverUser({ receiverUser: userData })
                // setMessages({ message: data?.messageUserData, receiver: userData })
                return;
            }
            const { data } = await axios.get(`${URL}/chat/message/${conversationId}`);
            setRecieverUser({ receiverUser: user, conversationId: conversationId })
            setMessages({ message: data?.messageUserData, receiver: user, conversationId })
        } catch (err) {
            console.log("Error", err)
        }
    }
    const fetchConversionData = async () => {
        try {
            const { data } = await axios.get(`${URL}/chat/conversation/${localuser?._id}`);
            setConverstaion(data?.conversationUserData)
            console.log(data?.conversationUserData)
            setSearchItem(data?.conversationUserData)
            const conversationId = data?.conversationUserData?.find((user) => id === user.user._id);
            handlemessageClick(conversationId?.conversationId, conversationId?.user)

        } catch (err) {
            console.log("Error", err)
        }
    }

    const handleSendMessage = async () => {
        socket?.emit('sendMessage', {
            senderId: localuser?._id,
            receiverId: reciverUser?.receiverUser?._id,
            message,
            conversationId: messages?.conversationId,
        })
        const { data } = await axios.post(`${URL}/chat/message`, {
            conversationId: messages?.conversationId,
            senderId: localuser?._id,
            message,
            receiverId: reciverUser?.receiverUser?._id
        })
        if (data.user) {
            setRecieverUser({ receiverUser: data?.user, conversationId: data?.newMessage?.conversationId })
            setConverstaion([...conversation, { user: data?.user, conversationId: data?.newMessage?.conversationId }]);
            // setMessages([...messages, { message: [{ message: data?.newMessage.message, user: data?.user }], receiver: data?.user, conversationId: data?.newMessage?.conversationId }])
        }
        setMessage("")
    }

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

    // Handle searching user
    const handleSerach = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
        const userInput = e.target.value.toLowerCase();
        // Filter the items array based on the user's input
        const matchingItems = conversation?.filter(({ user }) =>
            user.username.toLowerCase().includes(userInput) ||
            user.email.toLowerCase().includes(userInput)
        );
        setSearchItem(matchingItems);
        if (e.target.value.length <= 0) {
            setSearchItem(conversation)
        }
    }

    useEffect(() => {
        const handleWindowResize = () => {
            if (window.innerWidth > 500 && !chatWindow) {
                setChatWindow(false);
            } else {
                setChatWindow(true)
            }
        };
        // Add event listener for window resize
        window.addEventListener('resize', handleWindowResize);

        // Cleanup the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []); // Empty dependency array ensures this effect runs once on mount


    useEffect(() => {
        socket?.on('getMessage', data => {
            setMessages(prevState => ({
                ...prevState,
                message: [
                    ...prevState?.message,
                    { message: data.message, user: data.user }]
            }))
        })

    }, [socket])

    useEffect(() => {
        fetchConversionData()
    }, [id, onlineUser])

    console.log(conversation)
    return (
        <div className='chatbox_Container grid h-screen content-baseline' >
            <div className='sideBox p-5 bg-blue-50 max-sm:h-screen flex-col h-screen' style={{ display: window.innerWidth > 500 || !id ? 'flex' : 'none' }}>
                <div className='flex items-center gap-2'>
                    <IoArrowBackCircleOutline className='text-3xl text-gray-500' onClick={() => navigate("/home")} />
                    <img className='w-10 h-10 rounded-full cursor-pointer' src={localuser?.avatar || profile} alt="" onClick={((e) => { handleUserProfile(e, localuser) })} />
                    <span>
                        <p className='text-md font-light p-0 m-0 cursor-pointer' onClick={((e) => { handleUserProfile(e, localuser) })} >{localuser?.username || "Alstons"}</p>
                        <p className='text-sm font-extralight p-0 m-0'>My Account</p>
                    </span>
                </div>
                <hr className='my-5' />
                <div className='flex-1 h-screen overflow-y-scroll'>
                    <p className=' text-blue-500 font-semibold mb-5'>Messages</p>
                    <div className=' relative pb-5'>
                        <input type="search" placeholder='Search users...' className='w-full rounded-full border p-2 outline-none pl-9' value={searchValue} onChange={((e) => { handleSerach(e) })} />
                        <IoSearchOutline className=' absolute top-3 left-3' />
                    </div>
                    {searchItem?.map(({ user }, index) => (
                        <div key={index} >
                            <div className='flex items-center gap-2 relative'>
                                <img className='w-8 h-8 rounded-full cursor-pointer' src={user?.avatar || profile} alt="profile"
                                    onClick={() => {
                                        setChatWindow(true);
                                        navigate(`/home/chat/${user._id}`)
                                    }}
                                />
                                <span className='cursor-pointer' onClick={() => { navigate(`/home/chat/${user._id}`) }}>
                                    <p className='text-md font-light p-0 m-0'>{user?.username}</p>
                                    <p className='text-xs p-0 m-0'>Hlo</p>
                                    {onlineUser.find((onlineu => onlineu._id == user._id)) ? <p className='w-2 h-2 rounded-full absolute top-5 right-3 bg-green-600' ></p> : null}
                                </span>
                            </div>
                            <hr className='my-4' />
                        </div>
                    ))}
                </div>
            </div>
            <div className='h-full overflow-y-scroll flex flex-col'>

                {/* <img src={profile} alt="" /> */}
                <div className='relative w-full flex flex-col items-center justify-center pt-10 pb-5 max-sm:py-2'>
                    <IoArrowBackCircleOutline className='text-3xl text-gray-500 absolute top-3 left-3 sm:hidden' onClick={() => navigate("/home/chat")} />
                    <div className='flex items-center justify-between w-2/4 rounded-full px-5 my-5 bg-blue-50 max-sm:w-auto'>
                        <span className='flex items-center gap-2 w-2/4 rounded-full px-5 my-5 bg-blue-50 max-sm:w-auto'>
                            <img className='w-8 h-8 rounded-full' src={reciverUser?.receiverUser?.avatar || profile} alt="" />
                            <p className='text-lg font-semibold p-0 m-0'>{reciverUser?.receiverUser?.username || "Alston"}</p>

                        </span>
                        <p className='text-sm font-extralight p-0 m-0'>{onlineUser?.find((onlineu => onlineu?._id == reciverUser?.receiverUser?._id)) ? "Online" : "Offline"}</p>
                    </div>
                </div>
                <div className='flex-1 overflow-y-scroll'>
                    {messages.message?.map(({ user, message }, index) => {
                        if (localuser?._id == user?.id || localuser?._id == user?._id) {
                            return (
                                <div key={index}>
                                    <span className='flex items-center gap-2 px-5 float-right flex-row-reverse w-full'>
                                        <img className='w-8 h-8 rounded-full' src={user?.avatar || profile} alt="" />
                                        <p className=' bg-blue-600 rounded-b-xl rounded-tl-xl p-4 text-white mb-6' >{message}</p>
                                    </span>
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} className=' max-w-xs' >
                                    <span className='flex items-center gap-2 px-5 '>
                                        <img className='w-8 h-8 rounded-full' src={user?.avatar || profile} alt="" />
                                        <p className=' bg-blue-50 rounded-b-xl rounded-tr-xl p-4 text-black mb-6' >{message}</p>
                                    </span>
                                </div>
                            )
                        }

                    })}
                </div>


                <div className='sticky bottom-0 w-full flex items-center justify-center'>
                    <div className='w-4/5 relative'>
                        <div className='absolute top-3 left-4'>
                            <label for="file">
                                <div className="flex items-center justify-center">
                                    <MdAttachFile />
                                </div>
                                <input type="file" id="file" className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <form onSubmit={(e) => handleSendMessage(e)}>
                            <input type="text" value={message} placeholder='type here...' className='w-full rounded-full border p-2 outline-none pl-9' onChange={(e) => setMessage(e.target.value)} />
                            <button className='absolute top-3 right-4' >send</button>
                        </form>

                    </div>

                </div>

            </div>
        </div>
    )
}
