// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { FaPlay, FaPause } from 'react-icons/fa';

// const Reels = () => {
//     const [reels, setReels] = useState([]);
//     const [active, setActive] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false); // State for video playing status
//     const videoRef = useRef(null);

//     useEffect(() => {
//         axios
//             .get('http://localhost:9000/reels')
//             .then(response => {
//                 setReels(response.data.data);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     }, []);

//     useEffect(() => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.play();
//             } else {
//                 videoRef.current.pause();
//             }
//         }
//     }, [isPlaying, active]);

//     const toggleVideoPlay = () => {
//         setIsPlaying(prevIsPlaying => !prevIsPlaying);
//     };

//     const goPrev = () => {
//         setActive(prevActive => (prevActive === 0 ? reels.length - 1 : prevActive - 1));
//     };

//     const goNext = () => {
//         setActive(prevActive => (prevActive === reels.length - 1 ? 0 : prevActive + 1));
//     };

//     return (
//         <div className="reel__container">
//             {/* Reels */}
//             {reels.map((reel, index) => {
//                 return (
//                     <div
//                         className={`reel__feed ${index === active ? 'active' : ''}`}
//                         key={index}
//                     >
//                         <div className={`video__controller ${index === active ? 'active' : ''}`}>
//                             <video ref={videoRef} src={reel.fileUrl} loop></video>
//                             {/* Scroll-based video play functionality */}
//                             {index === active && (
//                                 <div
//                                     className={`video__overlay ${isPlaying ? 'hidden' : ''}`}
//                                     onClick={toggleVideoPlay}
//                                 >
//                                     <FaPlay className="play__icon" />
//                                 </div>
//                             )}
//                             {/* Video controller */}
//                             <div className={`video__controller ${index === active ? 'active' : ''}`}>
//                                 <div className="form__data">
//                                     <div className="feed__data">
//                                         <h3>{reel.username}</h3>
//                                         <p>{reel.content}</p>
//                                         <p>none</p>
//                                     </div>
//                                 </div>
//                                 <div className="video__controls">
//                                     <button onClick={toggleVideoPlay}>
//                                         {isPlaying ? <FaPause /> : <FaPlay />}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}

//             <div className="buttons">
//                 <button onClick={goPrev} disabled={reels.length <= 1}>
//                     &uarr; Previous Slide
//                 </button>
//                 <button onClick={goNext} disabled={reels.length <= 1}>
//                     Next Slide &darr;
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Reels;


import React from 'react'

export default function Reels() {
    return (
        <div>
            Reel
        </div>
    )
}

