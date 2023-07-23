import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Reels.scss';
import { FaPlay, FaPause } from 'react-icons/fa';

const Reels = () => {
    const [reels, setReels] = useState([]);
    const [active, setActive] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false); // State for video playing status
    const videoRef = useRef(null);

    useEffect(() => {
        axios
            .get('https://socail-media-backend.onrender.com/reels')
            .then(response => {
                setReels(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, active]);

    const toggleVideoPlay = () => {
        setIsPlaying(prevIsPlaying => !prevIsPlaying);
    };

    const handleScroll = e => {
        const delta = Math.sign(e.deltaY);

        if (delta === -1) {
            goPrev();
        } else if (delta === 1) {
            goNext();
        }
    };

    const goPrev = () => {
        setActive(prevActive => (prevActive === 0 ? reels.length - 1 : prevActive - 1));
    };

    const goNext = () => {
        setActive(prevActive => (prevActive === reels.length - 1 ? 0 : prevActive + 1));
    };

    return (
        <div className="reels-container" onWheel={handleScroll}>
            {reels.map((reel, index) => (
                <video
                    key={index}
                    ref={videoRef}
                    className={`reel-video ${index === active ? 'active' : ''}`}
                    src={reel.url}
                />
            ))}
            <div className="play-toggle" onClick={toggleVideoPlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
            </div>
        </div>
    );
};

export default Reels;
