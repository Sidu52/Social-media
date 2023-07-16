import { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", otp: "", password: "", conformpassword: "" });
    const [otpform, setOtpform] = useState(false);
    const [emailverify, setEmailverify] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:9000/user/login");
                if (response.data.data) {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    //OTP Sent
    const sendOTP = async (e) => {
        e.preventDefault();
        try {

            if (form.email) {
                setOtpform(true);
                toast.warn("Loading")
                const response = await axios.post('http://localhost:9000/user/emailverification', {
                    email: form.email // Include the email in the request body
                });

                if (response.data) {
                    toast.success(response.data.message)
                }
            }
        } catch (error) {
            console.log("fail", error);
            // Handle error cases if the post creation fails
        }
    }

    //OTP Verfied
    const handleOTP = async (e) => {
        e.preventDefault();
        try {
            if (form.email) {
                setOtpform(true);
                const response = await axios.post('http://localhost:9000/user/otpverification', {
                    email: form.email,
                    otp: form.otp
                });
                if (response.data) {
                    if (response.data.data) {
                        setEmailverify(true)
                    }

                    toast.success(response.data.message)
                }
            }
        } catch (error) {
            console.log("fail", error);
            toast.error("Fail")
        }
    }
    //Signup User
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (emailverify) {
                const response = await axios.post('http://localhost:9000/user/signup', {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    conformpassword: form.conformpassword
                });

                toast.success(response.data.message)
                if (response.data.data) {
                    navigate("/");
                }

            }
        } catch (error) {
            console.log("fail", error);
            // Handle error cases if the post creation fails
        }
    }
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