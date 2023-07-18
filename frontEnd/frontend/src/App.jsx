
import Form from "./pages/form/Form"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/form/component/Signin";
import Signup from "./pages/form/component/Signup";
import Home from "./pages/home/Home";
import Reels from "./pages/reels/Reels";
import Profile from "./pages/profile/Profile";
import UserPost from './components/Post/UserPost';
import UserReels from './components/Post/UserReels';
import UserSave from './components/Post/UserSave';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ loading }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/form"} element={<Form />}>
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path={'/'} element={<Home />} />
          <Route path={'/reels'} element={<Reels />} />
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
