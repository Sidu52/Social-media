import React from 'react'
import { useSelector } from 'react-redux';
export default function UserPost() {
    // Access the 'posts' state from the Redux store using the 'useSelector' hook
    const post = useSelector((state) => state.posts);

    return (
        <div className="row">
            {post.map((data, index) => (
                data.fileUrl ? (
                    <div className="img_data" key={index}>
                        <div className="view-overlay">
                            {data.fileType === 'png' || data.fileType === 'jpg' || data.fileType === 'jpeg' ||
                                data.fileType === 'gif' || data.fileType === 'webp' || data.fileType === 'jfif' ? (
                                <img src={data.fileUrl} className="img-fluid" alt="Post" />
                            ) : data.fileType === 'mp4' || data.fileType === 'avi' || data.fileType === 'mov' ||
                                data.fileType === 'wmv' ? (
                                <video src={data.fileUrl} className="img-fluid" alt="Post" loop controls />
                            ) : null}
                            <div className="mask">
                                <ul>
                                    <li>
                                        <p><i className="fa fa-comment" aria-hidden="true"></i> 32</p>
                                    </li>
                                    <li>
                                        <p><i className="fa fa-heart" aria-hidden="true"></i> 1.2K</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null
            ))}

        </div>
    )
}
