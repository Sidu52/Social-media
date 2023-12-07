import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux';
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import { MyContext } from '../../Context/Mycontext';
export default function UserPost() {
    const { URL, posts } = useContext(MyContext);

    // Access the 'posts' state from the Redux store using the 'useSelector' hook
    // const post = useSelector((state) => state.posts);
    const [hoverIndex, setHoverIndex] = useState(null);
    return (
        <div>
            <div className='grid grid-cols-3 items-center w-full gap-2'>
                {posts.map((data, index) => (
                    data.fileUrl ? (
                        <div key={index} className='relative max-w-80 h-64'
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            {
                                data.fileType === 'png' || data.fileType === 'jpg' || data.fileType === 'jpeg' ||
                                    data.fileType === 'gif' || data.fileType === 'webp' || data.fileType === 'jfif' ? (
                                    <img src={data.fileUrl} className="w-full h-full" alt="Post" />
                                ) : data.fileType === 'mp4' || data.fileType === 'avi' || data.fileType === 'mov' ||
                                    data.fileType === 'wmv' ? (
                                    <video src={data.fileUrl} className="w-full h-full" alt="Post" controls />
                                ) : null
                            }
                            < div className={`absolute top-0 bg-gray-800 bg-opacity-30 w-full h-full opacity-0 transition duration-300 ease-in-out ${hoverIndex === index ? 'opacity-100' : ''}`} >
                                <ul className='absolute inset-2/4 flex items-center justify-center gap-2 text-white'>
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
                        </div >
                    ) : null
                ))}
            </div>
        </div >
    )
}
