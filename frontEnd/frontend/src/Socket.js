import io from 'socket.io-client';

// const socket = io("http://localhost:9000"); // Replace with your server URL
const socket = io("http://192.168.29.91:9000"); // Replace with your server URL
// const socket = io("http://192.168.141.176:9000"); // Replace with your server URL
// const socket = io("https://socail-media-backend.onrender.com"); // Replace with your server URL

export default socket;
