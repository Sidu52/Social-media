import { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addData, add } from '../../../store/Store';

export default function Signin() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:9000/user/login");
                if (response.data.data) {
                    navigate("/");
                } else {
                    navigate("/form/signin")
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    //Signup User
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/user/signin', {
                email: form.email,
                password: form.password
            });
            const user = response.data.user;
            // Store user data in local storage
            localStorage.setItem('Data', JSON.stringify(user));
            const data = localStorage.getItem("Data")
            console.log(data)

            const newData = {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: '',
            };

            // dispatch(addData(newData));
            if (response.data) {
                toast.success(response.data.message)
                if (response.data.data) {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log("fail", error);
        }
    }
    return (
        <div className="formContainer">
            <h2 className='text'>Login</h2>
            <form>
                <div className="user-box">
                    <input
                        type="text"
                        onChange={((e) => { setForm({ ...form, email: e.target.value }) })}
                        name="email"
                        value={form.email}
                        required="" />
                    <label>Email</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        onChange={((e) => { setForm({ ...form, password: e.target.value }) })}
                        name="password"
                        value={form.password}
                        required="" />
                    <label>Password</label>
                </div>
                <a className="submit__button btn" onClick={onSubmit}>
                    Submit
                </a>
            </form>
            {/* <p className='text'>If you visit first time <Link to="signup" > Create Account</Link ></p> */}

        </div >
    )
}
