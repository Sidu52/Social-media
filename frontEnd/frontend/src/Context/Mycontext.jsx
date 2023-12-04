import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
const MyContext = React.createContext();

function MyProvider(props) {
  const [onlineUser, setOnlineUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notification, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatWindow, setChatWindow] = useState(true);

  useEffect(() => (
    // setSocket(io('http://localhost:8000'))
    setSocket(io('https://socail-media-backend.onrender.com'))
  ), [])
  // const Token = "W4lyaidIGicUCR1gCtaC2JEbn4D2AvzyRwRAHCCcUjvWOx6Epe";

  // const URL = "http://localhost:9000";
  // const URL = "http://192.168.29.91:9000"
  // const URL = "http://192.168.139.176:9000"
  const URL = "https://socail-media-backend.onrender.com";

  // const socket = io("http://localhost:9000"); // Replace with your server URL
  // const socket = io("http://192.168.29.91:9000"); // Replace with your server URL
  // const socket = io("http://192.168.139.176:9000"); // Replace with your server URL
  // const socket = io("https://socail-media-backend.onrender.com"); // Replace with your server URL
  // const socket = ""

  return (
    <MyContext.Provider value={{ onlineUser, posts, setPosts, notification, setNotifications, setOnlineUser, chatWindow, setChatWindow, URL, socket }}>
      {props.children}
    </MyContext.Provider>
  );
}
export { MyContext, MyProvider };
