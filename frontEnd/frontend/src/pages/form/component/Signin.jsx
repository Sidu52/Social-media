import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { MyContext } from "../../../Context/Mycontext";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/Store'
import login from '../../../assets/image/videologin.mp4'

export default function Signin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setOnlineUser, URL, socket } = useContext(MyContext);
    const data = JSON.parse(localStorage.getItem('Data'));

    // State variables to manage form data
    const [form, setForm] = useState({ email: "", password: "" });

    // Check if the user is already logged in using useEffect
    // useEffect(() => {
    //     if (data) {
    //         socket.emit('userLogin', data);
    //     }
    // }, []);

    // socket.on('updateUsers', async () => {
    //     try {
    //         const { data } = await axios.get(`${URL}/user/Onlineuser`);
    //         setOnlineUser(data.data);
    //     } catch (error) {
    //         console.error("Error fetching user data:", error);
    //     }
    // });

    // Function to handle user signin
    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`${URL}/user/signin`, {
                email: form.email,
                password: form.password
            });
            const user = response.data.user;
            // Store user data in local storage
            localStorage.setItem('Data', JSON.stringify(user));
            if (response.data.data) {
                dispatch(setLoading(false));
                navigate("/");
                // socket.emit('userLogin', response.data.user);
            }
        } catch (error) {
            console.log("fail", error);
        }
    }

    return (
        <div className='bg-white h-fit  max-w-3xl flex max-sm:flex-col mx-2 rounded-xl'>
            <div className=' w-3/4 h-full max-sm:h-2/6 max-sm:w-full'>
                <video className='w-full h-full object-cover' src={login} loop autoPlay muted />
            </div>

            <div className='w-full'>
                <p className='text-center mt-3'>SignIn</p>
                <form className='LoginForm  flex flex-col justify-center'>

                    <div className='relative mt-2 mx-4'>
                        <input
                            className='w-full bg-transparent p-1 text-base mb-4 border-b-2 outline-none'
                            type="text"
                            onChange={((e) => { setForm({ ...form, email: e.target.value }) })}
                            name="email"
                            value={form.email}
                            required />
                        <label className='absolute -top-1 left-0 transition-all duration-300 ease-linear '>Email</label>
                    </div>
                    <div className='relative mx-4 mt-2'>
                        <input
                            className='w-full bg-transparent p-1 text-base mb-4 border-b-2 outline-none'
                            type="password"
                            onChange={((e) => { setForm({ ...form, password: e.target.value }) })}
                            name="password"
                            value={form.password}
                            required />
                        <label className='absolute -top-1 left-0 transition-all duration-300 ease-linear '>Password</label>
                    </div>
                    <a className="px-4 py-2 mx-4 mb-5 w-24 rounded-xl bg-neutral-100 cursor-pointer" onClick={onSubmit}>
                        Submit
                    </a>
                </form>
            </div>
        </div>
    )
}
