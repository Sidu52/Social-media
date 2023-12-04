import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux';
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import { MyContext } from '../../Context/Mycontext';
export default function UserPost() {
    const { URL } = useContext(MyContext);

    // Access the 'posts' state from the Redux store using the 'useSelector' hook
    const post = useSelector((state) => state.posts);
    const [hoverIndex, setHoverIndex] = useState(null);
    return (
        <div className="profile_post_contaienr h-full grid content-baseline overflow-y-scroll justify-center">
            <div className='grid grid-cols-3 items-center w-full h-full gap-2'>
                {post.map((data, index) => (
                    data.fileUrl ? (
                        <div key={index} className='relative h-64 max-lg:h-52 flex items-center max-md:h-40 max-sm:h-20 border 1px'
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            {
                                data.fileType === 'png' || data.fileType === 'jpg' || data.fileType === 'jpeg' ||
                                    data.fileType === 'gif' || data.fileType === 'webp' || data.fileType === 'jfif' ? (
                                    <img src={data.fileUrl} className="w-full h-full" alt="Post" />
                                ) : data.fileType === 'mp4' || data.fileType === 'avi' || data.fileType === 'mov' ||
                                    data.fileType === 'wmv' ? (
                                    <video src={data.fileUrl} className="w-full h-full" alt="Post" />
                                ) : null
                            }
                            < div className={`absolute bg-gray-800 bg-opacity-30 w-full h-full opacity-0 transition duration-300 ease-in-out ${hoverIndex === index ? 'opacity-100' : ''}`} >
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

                        </div >
                    ) : null
                ))
                }

            </div>
        </div >
    )
}
