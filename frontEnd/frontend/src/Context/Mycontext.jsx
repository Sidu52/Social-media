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
    // setSocket(io('http://localhost:9000'))
    // setSocket(io("http://192.168.139.176:9000"))
    setSocket(io(`https://alston-social-media-jyyt.onrender.com`))
  ), [])

  // const URL = "http://localhost:9000";
  // const URL = "http://192.168.29.91:9000"
  // const URL = "http://192.168.139.176:9000"
  const URL = "https://alston-social-media-jyyt.onrender.com";

  return (
    <MyContext.Provider value={{ onlineUser, posts, setPosts, notification, setNotifications, setOnlineUser, chatWindow, setChatWindow, URL, socket }}>
      {props.children}
    </MyContext.Provider>
  );
}
export { MyContext, MyProvider };
