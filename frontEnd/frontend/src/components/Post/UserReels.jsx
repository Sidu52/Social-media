import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux';
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import { MyContext } from '../../Context/Mycontext';
export default function UserReels() {
    // Access the 'video post' state from the Redux store using the 'useSelector' hook
    // const post = useSelector((state) => state.reels);
    const { URL, posts } = useContext(MyContext);
    const data = JSON.parse(localStorage.getItem('Data'));
    const post = posts.filter((item) => {
        // Check if the fileType is one of the specified types and the user matches data._id
        return (
            (item.fileType === 'mp4' || item.fileType === 'avi' ||
                item.fileType === 'mov' || item.fileType === 'wmv') &&
            item.user === data._id
        );
    });

    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div>
            <div className='grid grid-cols-3 items-center w-full gap-2'>
                {post.map((data, index) => (
                    data.fileUrl ? (
                        <div className='relativef-full'
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            key={index}>
                            <div className="relative flex items-center max-w-80 h-64">
                                {data.fileType === 'png' || data.fileType === 'jpg' || data.fileType === 'jpeg' ||
                                    data.fileType === 'gif' || data.fileType === 'webp' || data.fileType === 'jfif' ? (
                                    <img src={data.fileUrl} className="w-full h-full" alt="Post" />
                                ) : data.fileType === 'mp4' || data.fileType === 'avi' || data.fileType === 'mov' ||
                                    data.fileType === 'wmv' ? (
                                    <video src={data.fileUrl} className="w-full h-full" alt="Post" loop controls />
                                ) : null}
                                <div className={`absolute bg-gray-800 bg-opacity-30 w-full h-full opacity-0 transition duration-300 ease-in-out ${hoverIndex === index ? 'opacity-100' : ''}`}>
                                    <ul className='absolute inset-2/4 flex items-center justify-center text-white'>
                                        <li className='flex items-center gap-2'>
                                            <FaHeart />
                                            <p><i className="" aria-hidden="true"></i>{data.likes.length}</p>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <FaCommentAlt />
                                            <p><i className="" aria-hidden="true"></i>{data.comments.length}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    )
}

