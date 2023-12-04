import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { FaHeart, FaCommentAlt } from "react-icons/fa";

export default function UserReels() {
    // Access the 'video post' state from the Redux store using the 'useSelector' hook
    const post = useSelector((state) => state.reels);
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div className="profile_post_contaienr h-80 overflow-y-scroll flex flex-col justify-center max-lg:h-96">
            <div className='grid grid-cols-3 items-center w-full h-full gap-2'>
                {post.map((data, index) => (
                    data.fileUrl ? (
                        <div className='relative h-64 max-lg:h-52 max-md:h-40 max-sm:h-28'
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            key={index}>
                            <div className="relative flex items-center w-full h-full">
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

