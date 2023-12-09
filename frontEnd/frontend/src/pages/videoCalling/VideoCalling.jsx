import React, { useRef, useEffect, useContext } from 'react'
import { MyContext } from '../../Context/Mycontext';
function VideoCalling() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const localVideo = localVideoRef.current;
        const remoteVideo = remoteVideoRef.current;
        const { URL, socket } = useContext(MyContext);


        const initializeWebRTC = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                if (localVideo) {
                    localVideo.srcObject = stream;
                    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
                }

                // Continue with the rest of your WebRTC setup
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initializeWebRTC();

        // Handle signaling events

        socket?.on('offer', (offer, senderSocketId) => {
            handleOffer(offer, senderSocketId);
        });

        socket?.on('answer', (answer) => {
            handleAnswer(answer);
        });

        socket?.on('ice-candidate', (candidate) => {
            handleIceCandidate(candidate);
        });

        // Set up local peer connection to handle ice candidate events
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // Send ice candidate to the remote peer
                socket.emit('ice-candidate', event.candidate);
            }
        };

        // Implement the logic to handle the offer, answer, and ice candidate events

        // Create an offer and send it to the remote peer
        function createOffer() {
            peerConnection.createOffer()
                .then((offer) => peerConnection.setLocalDescription(offer))
                .then(() => {
                    socket.emit('offer', peerConnection.localDescription);
                })
                .catch((error) => console.error('Error creating offer:', error));
        }

        // Create an answer and send it to the remote peer
        function createAnswer() {
            peerConnection.createAnswer()
                .then((answer) => peerConnection.setLocalDescription(answer))
                .then(() => {
                    socket.emit('answer', peerConnection.localDescription);
                })
                .catch((error) => console.error('Error creating answer:', error));
        }

        // Handle incoming offer and create an answer
        function handleOffer(offer, senderSocketId) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => createAnswer())
                .catch((error) => console.error('Error handling offer:', error));
        }

        // Handle incoming answer
        function handleAnswer(answer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                .catch((error) => console.error('Error handling answer:', error));
        }

        // Handle incoming ice candidate
        function handleIceCandidate(candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                .catch((error) => console.error('Error handling ice candidate:', error));
        }

        // Start the video call
        createOffer();

    }, []);
    return (
        <div>
            <h1>WebRTC Video Call</h1>
            <video ref={localVideoRef} id="localVideo" autoPlay playsInline></video>
            <video ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline></video>
        </div>
    )
}
export default VideoCalling;