import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
const MyContext = React.createContext();

function MyProvider(props) {
  const [onlineUser, setOnlineUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [notification, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatWindow, setChatWindow] = useState(true);
  const IPTYPE = "production"
  // const IPTYPE = "home"
  // const IPTYPE = "office"
  const allowedOrigins =
    IPTYPE === 'production'
      ? 'https://alston-social-media-jyyt.onrender.com'
      : IPTYPE === 'home'
        ? 'http://192.168.139.176:9000'
        : 'http://192.168.29.91:9000';

  useEffect(() => (
    // setSocket(io('http://localhost:9000'))
    setSocket(io(allowedOrigins))
  ), [])

  // const URL = "http://localhost:9000";
  // const URL = "http://192.168.29.91:9000"
  const URL = allowedOrigins
  // "http://192.168.139.176:9000"
  // const URL = "https://alston-social-media-jyyt.onrender.com";

  return (
    <MyContext.Provider value={{ users, setUsers, onlineUser, posts, setPosts, notification, setNotifications, setOnlineUser, chatWindow, setChatWindow, URL, socket }}>
      {props.children}
    </MyContext.Provider>
  );
}
export { MyContext, MyProvider };
