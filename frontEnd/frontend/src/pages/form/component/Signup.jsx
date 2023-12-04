import { useState, useEffect } from 'react'
import axios from 'axios';
import { URL } from '../../../../endepointURL';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/Store'
import signup from '../../../assets/image/videoSignup.mp4'

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
        // <div className="formContainer">
        //     <h2 className='text'>SignUp</h2>
        //     <form>
        //         <div className="user-box">
        //             <input
        //                 type="text"
        //                 onChange={((e) => { setForm({ ...form, username: e.target.value }) })}
        //                 name="username"
        //                 value={form.username}
        //                 required />
        //             <label>Username</label>
        //         </div>
        //         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        //             <div className="user-box" style={{ width: "60%" }}>
        //                 <input
        //                     type="email"
        //                     readOnly={emailverify}
        //                     onChange={((e) => { setForm({ ...form, email: e.target.value }) })}
        //                     name="email"
        //                     value={form.email}
        //                     required
        //                 />
        //                 <label>Email</label>
        //             </div>{
        //                 emailverify ?
        //                     <button className='button1' style={{ background: "green", color: "#fff" }}>Verify</button> :
        //                     <button className='button1' onClick={sendOTP}>Genrate OTP</button>
        //             }
        //         </div>
        //         {/* OTP VERIFICATION */}
        //         <div
        //             style={{ display: otpform && !emailverify ? "flex" : "none", alignItems: "center", gap: "10px" }}>
        //             <div className="user-box" style={{ width: "60%" }}>
        //                 <input
        //                     type="Number"
        //                     onChange={((e) => { setForm({ ...form, otp: e.target.value }) })}
        //                     name="otp"
        //                     value={form.otp}
        //                     min="1000"
        //                     max="9999"
        //                     required />
        //                 <label>Enter OTP</label>
        //             </div>
        //             <button className='button1' onClick={handleOTP}>Verify</button>
        //         </div>
        //         <div className="user-box">
        //             <input
        //                 type="password"
        //                 onChange={((e) => { setForm({ ...form, password: e.target.value }) })}
        //                 name="password"
        //                 value={form.password}
        //                 required="" />
        //             <label>Password</label>
        //         </div>
        //         <div className="user-box">
        //             <input
        //                 type="password"
        //                 onChange={((e) => { setForm({ ...form, conformpassword: e.target.value }) })}
        //                 name="Conform_password"
        //                 value={form.conformpassword}
        //                 required="" />
        //             <label>Conform-Password</label>
        //         </div>
        //         <a className="submit__button btn" onClick={onSubmit}>
        //             Submit
        //         </a>
        //     </form>
        // </div>

        <div className='bg-white h-4/6  max-w-3xl flex max-sm:flex-col mx-2 rounded-xl'>
            <div className=' w-3/4 h-full max-sm:h-2/6 max-sm:w-full'>
                <video className='w-full h-full object-cover' src={signup} loop autoPlay />
            </div>

            <div className='w-full'>
                <p className='text-center mt-3'>SignUp</p>
                <form className='LoginForm  flex flex-col justify-center'>
                    <div className='relative mx-4 mt-2'>
                        <input
                            className=' w-full bg-transparent p-1 text-base mb-6 border-b-2 outline-none'
                            type="text"
                            onChange={((e) => { setForm({ ...form, username: e.target.value }) })}
                            name="username"
                            value={form.username}
                            required />
                        <label className='absolute -top-1 left-0 transition-all duration-300'>Username</label>
                    </div>
                    <div className='flex items-center gap-2 mx-4 '>
                        <div className='relative mt-2'>
                            <input
                                className='w-full bg-transparent p-1 text-base mb-4 border-b-2 outline-none'
                                type="email"
                                readOnly={emailverify}
                                onChange={((e) => { setForm({ ...form, email: e.target.value }) })}
                                name="email"
                                value={form.email}
                                required />
                            <label className='absolute -top-1 left-0 transition-all duration-300 ease-linear '>Email</label>
                        </div> {emailverify ?
                            <button className='p-2 border-none rounded-md font-medium min-w-fit' style={{ background: "green", color: "#fff" }}>Verify</button> :
                            <button className='p-2 border-none rounded-md font-medium min-w-fit bg-gray-100 cursor-pointer' onClick={sendOTP}>Genrate OTP</button>
                        }
                    </div>
                    {/* OTP VERIFICATION */}
                    <div
                        style={{ display: otpform && !emailverify ? "flex" : "none", alignItems: "center", gap: "10px" }}>
                        <div className='relative mt-2 mx-4' style={{ width: "60%" }}>
                            <input
                                className='w-full bg-transparent p-1 text-base mb-4 border-b-2 outline-none'
                                type="Number"
                                onChange={((e) => { setForm({ ...form, otp: e.target.value }) })}
                                name="otp"
                                value={form.otp}
                                min="1000"
                                max="9999"
                                required />
                            <label className='absolute -top-1 left-0 transition-all duration-300 ease-linear'>Enter OTP</label>
                        </div>
                        <button className='p-2 border-none rounded-md font-medium min-w-fit cursor-pointer' onClick={handleOTP}>Verify</button>
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
                    <div className='relative mx-4 mt-2'>
                        <input
                            className='w-full bg-transparent p-1 text-base mb-4 border-b-2 outline-none'
                            type="password"
                            onChange={((e) => { setForm({ ...form, conformpassword: e.target.value }) })}
                            name="Conform_password"
                            value={form.conformpassword}
                            required />
                        <label className='absolute -top-1 left-0 transition-all duration-300 ease-linear '>Conform-Password</label>
                    </div>
                    <a className="px-4 py-2 mx-4 w-24 rounded-xl bg-neutral-100 cursor-pointer" onClick={onSubmit}>
                        Submit
                    </a>
                </form>
            </div>
        </div>



    )
}