import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/Store'

export default function Signin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State variables to manage form data
    const [form, setForm] = useState({ email: "", password: "" });

    // Check if the user is already logged in using useEffect
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:9000/user/login");
                if (response.data.data) {
                    // If the user is already logged in, navigate to the home page
                    navigate("/");
                } else {
                    // If the user is not logged in, show the signin form
                    navigate("/form/signin")
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    // Function to handle user signin
    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await axios.post('http://localhost:9000/user/signin', {
                email: form.email,
                password: form.password
            });
            const user = response.data.user;
            // Store user data in local storage
            localStorage.setItem('Data', JSON.stringify(user));
            if (response.data.data) {
                dispatch(setLoading(false));
                // If signin is successful, navigate to the home page
                navigate("/");
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
                <a className="submit__button btn" onClick={onSubmit}>Submit</a>
            </form>
        </div >
    )
}
