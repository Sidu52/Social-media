import { useState, useEffect } from 'react'
import axios from 'axios';
import { URL } from '../../../../endepointURL';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/Store'

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State variables to manage form data, OTP, and email verification  
    const [form, setForm] = useState({ username: "", email: "", otp: "", password: "", conformpassword: "" });
    const [otpform, setOtpform] = useState(false);
    const [emailverify, setEmailverify] = useState(false);

    // Check if the user is already logged in using useEffect
    useEffect(() => {
        const fetchUserData = async () => {

            try {
                const response = await axios.get(`${URL}/user/login`);
                if (response.data.data) {
                    // If the user is already logged in, navigate to the home page
                    navigate("/");
                } else {
                    // If the user is not logged in, show the signup form
                    navigate("/form/signup");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    // Function to send OTP for email verification
    const sendOTP = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            if (form.email) {
                setOtpform(true);
                //setLoading 'true' in Redux for show loading bar
                dispatch(setLoading(true));
                // Send a POST request to the server to request email verification
                const response = await axios.post(`${URL}/user/emailverification`, {
                    email: form.email,
                });
                //setLoading 'false' in Redux for hide loading bar
                dispatch(setLoading(false));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log("fail", error);
            // Handle error cases if the post creation fails
        }
    };


    // Function to handle OTP verification
    const handleOTP = async (e) => {
        e.preventDefault(); // Prevent form submission
        try {
            if (form.email) {
                console.log("object")
                setOtpform(true); // Set otpform state to true
                // Send a POST request to the server to verify the OTP
                const response = await axios.post(`${URL}/user/otpverification`, {
                    email: form.email,
                    otp: form.otp
                });
                if (response.data) {
                    if (response.data.data) {
                        setEmailverify(true);
                    }
                    toast.success(response.data.message);
                }
            }
        } catch (error) {
            console.log("fail", error);
            toast.error("Fail"); // Display a generic error message
        }
    };

    // Function to handle user signup
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (emailverify) {
                dispatch(setLoading(true));
                // Send a POST request to the server for user signup
                const response = await axios.post(`${URL}/user/signup`, {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    conformpassword: form.conformpassword
                });

                const user = response.data.user;
                localStorage.setItem('Data', JSON.stringify(user)); // Store user data in local storage
                dispatch(setLoading(false));

                if (response.data.action) {
                    navigate("/"); // Navigate to a specific page if the 'action' property is present in the response
                }
            }
        } catch (error) {
            console.log("fail", error);
            // Handle error cases if the post creation fails
        }
    };

    return (
        <div className="formContainer">
            <h2 className='text'>SignUp</h2>
            <form>
                <div className="user-box">
                    <input
                        type="text"
                        onChange={((e) => { setForm({ ...form, username: e.target.value }) })}
                        name="username"
                        value={form.username}
                        required />
                    <label>Username</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="user-box" style={{ width: "60%" }}>
                        <input
                            type="email"
                            readOnly={emailverify}
                            onChange={((e) => { setForm({ ...form, email: e.target.value }) })}
                            name="email"
                            value={form.email}
                            required
                        />
                        <label>Email</label>
                    </div>{
                        emailverify ?
                            <button className='button1' style={{ background: "green", color: "#fff" }}>Verify</button> :
                            <button className='button1' onClick={sendOTP}>Genrate OTP</button>
                    }
                </div>
                {/* OTP VERIFICATION */}
                <div
                    style={{ display: otpform && !emailverify ? "flex" : "none", alignItems: "center", gap: "10px" }}>
                    <div className="user-box" style={{ width: "60%" }}>
                        <input
                            type="Number"
                            onChange={((e) => { setForm({ ...form, otp: e.target.value }) })}
                            name="otp"
                            value={form.otp}
                            min="1000"
                            max="9999"
                            required />
                        <label>Enter OTP</label>
                    </div>
                    <button className='button1' onClick={handleOTP}>Verify</button>
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
                <div className="user-box">
                    <input
                        type="password"
                        onChange={((e) => { setForm({ ...form, conformpassword: e.target.value }) })}
                        name="Conform_password"
                        value={form.conformpassword}
                        required="" />
                    <label>Conform-Password</label>
                </div>
                <a className="submit__button btn" onClick={onSubmit}>
                    Submit
                </a>
            </form>
        </div>
    )
}
