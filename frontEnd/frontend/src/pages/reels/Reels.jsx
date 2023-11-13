import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { URL } from '../../../endepointURL';
import './Reels.scss';
import { FaPlay, FaPause } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import Profile from '../profile/Profile';

const Reels = () => {
    const [reels, setReels] = useState([]);
    const [active, setActive] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRefs = useRef([]);
    const user = JSON.parse(localStorage.getItem('Data'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${URL}/reels`);
                if (data.data) {
                    setReels(data.data);
                    videoRefs.current = data.data.map(() => React.createRef());
                } else {
                    console.log("Data not found");
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        if (videoRefs.current[active] && videoRefs.current[active].current) {
            if (isPlaying) {
                videoRefs.current[active].current.play();
            } else {
                videoRefs.current[active].current.pause();
            }
        }
    }, [isPlaying, active]);

    const toggleVideoPlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleScroll = debounce((e) => {
        const delta = Math.sign(e.deltaY);
        if (delta === -1) {
            goPrev();
        } else if (delta === 1) {
            goNext();
        }
    }, 200);

    const goPrev = () => {
        setIsPlaying(false); // Pause current video
        videoRefs.current[active].current.pause(); // Explicitly pause the current video
        setActive((prevActive) => (prevActive === 0 ? reels.length - 1 : prevActive - 1));
        setIsPlaying(true); // Play previous video
        videoRefs.current[active === 0 ? reels.length - 1 : active - 1].current.play(); // Explicitly play the previous video
    };

    const goNext = () => {
        setIsPlaying(false); // Pause current video
        videoRefs.current[active].current.pause(); // Explicitly pause the current video
        setActive((prevActive) => (prevActive === reels.length - 1 ? 0 : prevActive + 1));
        setIsPlaying(true); // Play next video
        videoRefs.current[active === reels.length - 1 ? 0 : active + 1].current.play(); // Explicitly play the next video
    };


    return (
        <div className="post__container reels-container" onWheel={handleScroll} >
            <div className="reels-wrapper">
                {reels.map((reel, index) => (
                    <div key={index} style={{ position: 'relative',height:"100%" }}>
                        <video
                            onClick={toggleVideoPlay}
                            autoPlay={index === active}
                            loop={index === active}
                            className={`reel-video ${index === active ? 'active' : ''}`}
                            src={reel.fileUrl}
                            ref={videoRefs.current[index]}
                        />
                        {index === active && (
                            <div className='reel_detail_container'>
                                <div style={{ display: "flex", gap: '10px', alignItems: 'center' }}>
                                    <img
                                        src={user && user.avatar ? user.avatar : Profile}
                                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                    />
                                    <h3>{user.username}</h3>
                                </div>
                                <p>{reel.content}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="play-toggle" onClick={toggleVideoPlay}>
                {isPlaying ? null : <FaPlay className={!isPlaying ? "svgPause" : ""} />}
            </div>
        </div>
    );
};

export default Reels;
