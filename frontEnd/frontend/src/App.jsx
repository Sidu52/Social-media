
import Form from "./pages/form/Form"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import Welcome from "./pages/welcome/welcome";
import Signin from "./pages/form/component/Signin";
import Signup from "./pages/form/component/Signup";
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ }) {
  const loading = useSelector((state) => state.loading);
  return (
    <>
      <div className="loader" style={{ display: loading ? "block" : "none" }}></div>
      <BrowserRouter>
        <Routes>
          <Route path={"/form"} element={<Form />}>
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path={'/'} element={<Welcome />} />
          <Route path="/home" element={<HomeRoute />}>
            <Route path='' element={<Home />}>
              <Route index element={<Feed />} />
              <Route path="reels" element={<Reels />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path={"/profile"} element={<Profile />}>
            <Route path="post" element={<UserPost />} />
            <Route path="reel" element={<UserReels />} />
            <Route path="save" element={<UserSave />} />
          </Route>
        </Routes >
      </ BrowserRouter>
      <ToastContainer />
    </>
  )
}
