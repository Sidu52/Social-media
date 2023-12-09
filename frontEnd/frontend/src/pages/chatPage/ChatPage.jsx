import React from 'react'
import axios from 'axios';
import './ChatPage.scss'
import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext } from '../../Context/Mycontext';
import profile from '../../assets/image/profile.png';
import { MdAttachFile, MdOutlineEmojiEmotions } from "react-icons/md"
import './ChatPage.scss';
import { IoSearchOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import moment from 'moment/moment';
import { data } from 'autoprefixer';

export default function ChatPage() {
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    // Retrieve the ID parameter from the URL
    const { id } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
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
    const [showEmojis, setShowEmojis] = useState(false);
    const [typing, setTyping] = useState(false);

    const formatTimestamp = (timestamp) => {
        const date = moment(timestamp);
        const now = moment();

        const timeDifference = now.diff(date, 'seconds');

        if (timeDifference < 60) {
            return (<span>{timeDifference} seconds ago</span>);
        } else if (timeDifference < 3600) {
            const minutes = moment.duration(timeDifference, 'seconds').minutes();
            return (<span>{minutes} minutes ago</span>);
        } else if (timeDifference < 86400) {
            const hours = moment.duration(timeDifference, 'seconds').hours();
            return (<span>{hours} hours ago</span>);
        } else {
            return (<span>{date.format('MMMM Do YYYY')}</span>); // Display the full date for older messages
        }
    };
    const renderTimestamp = (currentTimestamp, prevTimestamp) => {
        const currentMoment = moment(currentTimestamp);
        const prevMoment = moment(prevTimestamp);

        const timeDifference = currentMoment.diff(prevMoment, 'minute');
        // return formatTimestamp(currentTimestamp);
        if (timeDifference >= 2) {
            return formatTimestamp(currentTimestamp);
        }

        return null; // Return null if the difference is less than 2 hours
    };


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
            setSearchItem(data?.conversationUserData)
            const conversationId = data?.conversationUserData?.find((user) => id === user?.user?._id);
            handlemessageClick(conversationId?.conversationId, conversationId?.user)

        } catch (err) {
            console.log("Error", err)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const { data } = await axios.post(`${URL}/chat/message`, {
            conversationId: messages?.conversationId,
            senderId: localuser?._id,
            message,
            receiverId: reciverUser?.receiverUser?._id
        })
        if (data.user) {
            socket?.emit('sendMessage', {
                senderId: localuser?._id,
                receiverId: reciverUser?.receiverUser?._id,
                message,
                conversationId: messages?.conversationId,
            })
            setRecieverUser({ receiverUser: data?.user, conversationId: data?.newMessage?.conversationId })
            setConverstaion([...conversation, { user: data?.user, conversationId: data?.newMessage?.conversationId }]);
            // setMessages([...messages, { message: [{ message: data?.newMessage.message, user: data?.user }], receiver: data?.user, conversationId: data?.newMessage?.conversationId }])
        }
        setMessage("")
        setShowEmojis(false)
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
    //Add emoji
    const handleEmojiClick = (emoji) => {
        setMessage((prevMessage) => prevMessage + emoji.emoji); // Update the message with the clicked emoji
    };
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
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        socket?.on('getMessage', data => {
            setMessages(prevState => ({
                ...prevState,
                message: [
                    ...prevState?.message,
                    { message: data.messageUserData.message[data.messageUserData.message.length - 1], user: data.messageUserData.user }]
            }))
        })

        socket?.on('inputfocusserver', value => {
            console.log(value)
            setTyping(value)
        })

    }, [socket])

    useEffect(() => {
        fetchConversionData()
    }, [id, onlineUser])
    return (
        <div className='chatbox_Container grid h-screen content-baseline'>
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
                <div className='flex-1 overflow-y-scroll'>
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
                                    {onlineUser.find((onlineu => onlineu?._id == user?._id)) ? <p className='w-2 h-2 rounded-full absolute top-5 right-3 bg-green-600' ></p> : null}
                                </span>
                            </div>
                            <hr className='my-4' />
                        </div>
                    ))}
                </div>
            </div>


            <div className="h-screen flex flex-col">
                {/* User info container */}
                <div className="bg-blue-50 p-4 sticky top-0 flex items-center">
                    <IoArrowBackCircleOutline className='text-3xl text-gray-500 sm:hidden' onClick={() => navigate("/home/chat")} />
                    {/* User info content */}
                    {/* For example */}
                    <div className=' w-full flex items-center justify-between'>
                        <span className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full' src={reciverUser?.receiverUser?.avatar || profile} alt="" />
                            <p className='text-lg font-semibold p-0 m-0'>{reciverUser?.receiverUser?.username || "Alston"}</p>
                        </span>
                        {typing ?
                            <span className='flex gap-2 flex-row items-end'>
                                <p className='text-sm font-extralight p-0 m-0'>typing</p>
                                <section class="flex items-center justify-center h-full w-full">
                                    <div class="dot animate-pulse delay-300 w-1 h-1 mr-1 rounded-full bg-gray-300"></div>
                                    <div class="dot animate-pulse delay-100 w-1 h-1 mr-1 rounded-full bg-gray-300"></div>
                                    <div class="dot animate-pulse delay-100 w-1 h-1 mr-1 rounded-full bg-gray-300"></div>
                                </section>
                            </span>
                            : <p className='text-sm font-extralight p-0 m-0'>{onlineUser?.find((onlineu => onlineu?._id == reciverUser?.receiverUser?._id)) ? "Online" : "Offline"}</p>}
                    </div>

                </div>

                {/* Message box container */}
                <div className="flex-1 overflow-y-scroll p-4" ref={scrollRef}>

                    {/* Messages content */}
                    {/* For example */}
                    <div className="flex flex-col space-y-4" >
                        {
                            messages.message?.map(({ user, message }, index) => {
                                const isLocalUser = localuser?._id === user?.id || localuser?._id === user?._id;
                                return (
                                    <div key={index} >
                                        {index > 0 && (
                                            <p className='w-full text-center'> {renderTimestamp(message?.createdAt, messages.message[index - 1]?.message.createdAt)}</p>
                                        )
                                        }

                                        {
                                            isLocalUser ? (
                                                <div className='flex items-center gap-2 px-5 max-sm:px-2 justify-start flex-row-reverse' >
                                                    <img className='w-8 h-8 rounded-full' src={user?.avatar || profile} alt="" />
                                                    <p className='bg-blue-600 rounded-b-xl rounded-tl-xl p-4 text-white max-w-xs'>{message?.message}</p>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-2 px-5 max-sm:px-2 '>
                                                    <img className='w-8 h-8 rounded-full' src={user?.avatar || profile} alt="" />
                                                    <p className='bg-blue-100 rounded-b-xl rounded-tr-xl p-4 text-black max-w-xs'>{message?.message}</p>
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                    </div>

                </div>

                {/* Input section */}
                <div className="bg-blue-50 p-4 sticky bottom-0">
                    {showEmojis && (
                        <div className=' absolute bottom-14 left-0'>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    {/* Message input and send button */}
                    <form className="flex items-center relative" onSubmit={(e) => {
                        if (reciverUser?.receiverUser) {
                            handleSendMessage(e)
                        }}}>
                        <div className='max-sm:absolute flex items-center gap-3 max-sm:gap-0'>
                            <label for="file">
                                <div className="flex items-center justify-center ">
                                    <MdAttachFile />
                                </div>
                                <input type="file" id="file" className="hidden" accept="image/*" />
                            </label>
                            <div className="flex items-center justify-center max-sm:pl-1">
                                <MdOutlineEmojiEmotions className=" text-2xl" onClick={() => setShowEmojis(!showEmojis)} />
                            </div>
                        </div>
                        <input
                            type="text"
                            value={message}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-full py-2 px-4 focus:outline-none max-sm:pr-5 pl-10"
                            onChange={(e) => setMessage(e.target.value)}
                            onFocus={(e) => {
                                if (localuser) {
                                    console.log(userData)
                                    socket.emit("inputfocus", { receiverId: reciverUser?.receiverUser?._id, value: true })
                                }
                            }
                            }
                            onBlur={(e) => {
                                console.log("object", blur)
                                if (localuser) {
                                    socket.emit("inputfocus", { receiverId: reciverUser?.receiverUser?._id, value: false })
                                }
                            }
                            }
                        />
                        <button type='submit' className="max-sm:hidden ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full max-sm:absolute max-sm:right-0 max-sm:py-1">
                            Send
                        </button>
                        <button type='submit'> <FiSend className="sm:hidden" /></button>

                    </form>
                </div>
            </div >
        </div >

    )
}
