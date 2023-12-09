import { useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyContext } from './Context/Mycontext';
import { useSelector } from 'react-redux';
import Welcome from "./pages/welcome/welcome";
import HomeRoute from "./HomeRoute";
import Home from "./pages/home/Home";
import Reels from "./pages/reels/Reels";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Profile from "./pages/profile/Profile";
import UserPost from './components/Post/UserPost';
import UserReels from './components/Post/UserReels';
import UserSave from './components/Post/UserSave';
import Feed from "./components/homebody/feed/Feed";
import ChatPage from "./pages/chatPage/ChatPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter } from "react-router-dom";
import VideoCalling from './pages/videoCalling/VideoCalling';

export default function App({ }) {
  const { setOnlineUser, socket } = useContext(MyContext);
  const localuser = JSON.parse(localStorage.getItem('Data'));

  useEffect(() => {
    socket?.emit('addUser', localuser?._id)
    // socket?.on('getUsers', users => {
    //   console.log("ActiveUSers=>", users)
    // })
    socket?.on("getOnlineUsers", data => {
      setOnlineUser(data)
    })
  }, [socket]);
  const loading = useSelector((state) => state.loading);
  return (
    <div className=''>
      <div class="loader absolute  w-full h-full bg-black bg-opacity-50 z-10" style={{ display: loading ? "block" : "none" }}>
        <div class="wrapper absolute top-2/4 left-2/4 -translate-x-2/3" >
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="shadow"></div>
          <div class="shadow"></div>
          <div class="shadow"></div>
        </div>
      </div>
      <HashRouter basename="/">
        <Routes>
          <Route path={'/'} element={<Welcome />} />
          <Route path="/home" element={<HomeRoute />}>
            <Route path='' element={<Home />}>
              <Route index element={<Feed />} />
              <Route path="reels" element={<Reels />} />
              <Route path="video" element={<VideoCalling />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="chat/:id" element={<ChatPage />} />
          </Route>
          <Route path={"/profile"} element={<Profile />}>
            <Route path="post" element={<UserPost />} />
            <Route path="reel" element={<UserReels />} />
            <Route path="save" element={<UserSave />} />
          </Route>
        </Routes >
      </ HashRouter>
      <ToastContainer />
    </div>
  )
}
