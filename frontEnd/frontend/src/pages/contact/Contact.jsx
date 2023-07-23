
import { useState } from 'react';
import { BsFillTelephoneForwardFill } from 'react-icons/bs'
import { BiLogoLinkedin, BiLogoYoutube, BiLogoInstagram, BiLogoWhatsapp, } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import Topbar from '../../components/homebody/topbar/Topbar';
import './Contact.scss'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/Store'

export default function Contact() {
    const dispatch = useDispatch();
    // State variables to manage form data and error messages
    const [form, setForm] = useState({ name: "", email: "", companyName: "", message: "" })
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validating the form fields
        if (form.name === '') {
            setNameError('Please fill out this field!');
        }
        else {
            setNameError('');
        }

        if (form.email === '') {
            setEmailError('Please fill out this field!');
        }
        else {
            setEmailError('');
        }

        try {
            //set setLoading value 'true' for show loading bar
            dispatch(setLoading(true));
            const response = await axios.post("https://socail-media-backend.onrender.com/user/contactMail", {
                data: form,
            });
            //set setLoading value 'false' for hide loading bar
            dispatch(setLoading(false));
            toast.success(response.data.message)
        } catch (error) {
            console.error("Error fetching user data:", error);
        }

        // Clearing the form after submission
        setForm({ name: "", email: "", companyName: "", message: "" })
    };

    // Function to reset the form and error messages
    const handleReset = () => {
        setForm({ name: "", email: "", companyName: "", message: "" })
        setNameError('');
        setEmailError('');
    };

    return (
        <>
            <Topbar />
            <div id='Contact' className="contact__container">
                <div className="contact__sub_container">
                    <div className="contact_form_container">
                        <h4>Connect With Me, I Here.</h4>
                        <h2 className="form-headline">Send us a message</h2>
                        <form id="submit-form" onSubmit={handleSubmit}>
                            <p>
                                <input
                                    id="name"
                                    className="form-input"
                                    type="text"
                                    placeholder="Your Name*"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                <small className="name-error">{nameError}</small>
                            </p>
                            <p>
                                <input
                                    id="email"
                                    className="form-input"
                                    type="email"
                                    placeholder="Your Email*"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                                <small className="name-error">{emailError}</small>
                            </p>
                            <p className="full-width">
                                <input
                                    id="company-name"
                                    className="form-input"
                                    type="text"
                                    placeholder="Company Name*"
                                    value={form.companyName}
                                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                />
                                <small></small>
                            </p>
                            <p className="full-width">
                                <textarea
                                    minLength="20"
                                    id="message"
                                    cols="30"
                                    rows="7"
                                    placeholder="Your Message*"
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    required
                                ></textarea>
                                <small></small>
                            </p>
                            <p className="full-width">
                                <input
                                    type="checkbox"
                                    id="checkbox"
                                    name="checkbox"
                                    defaultChecked
                                />{' '}
                                Yes, I fill All field.
                            </p>
                            <p className="full-width">
                                <input type="submit" className="submit-btn" value="Submit" />
                                <button className="reset-btn" type="button"
                                    onClick={handleReset}>
                                    Reset
                                </button>
                            </p>
                        </form>
                    </div>

                    <div className="contacts">
                        <ul>
                            <li>
                                As a Full Stack Web Developer, I builded a foundation in programming and development concepts. I create{' '}
                                <span className="highlight-text-grey">30 +</span> more project in FrontEnd, BackEnd and FullStack
                            </li>
                            <span className="hightlight-contact-info">
                                <li className="email-info">
                                    <MdEmail />{' '}
                                    <a href="mailto:siddhantsharma9926@gmail.com" style={{ color: "black" }} >siddhantsharma9926@gmail.com</a>

                                </li>
                                <li>
                                    <BsFillTelephoneForwardFill />
                                    {' '}
                                    <span className="highlight-text">+91 8085984844</span>
                                </li>
                            </span>
                        </ul>
                        <div className="contact__social_icon">
                            <div className="card">
                                <a href="https://www.linkedin.com/in/siddhantsharma9" className="socialContainer linkedin">
                                    <BiLogoLinkedin />
                                </a>

                                <a href="https://www.youtube.com/@Sidhualston/featured" className="socialContainer youtube">
                                    <BiLogoYoutube />
                                </a>

                                <a href="https://www.instagram.com/sidhu_alston/" className="socialContainer instagram">
                                    <BiLogoInstagram />
                                </a>

                                <a href="https://wa.me/8085984844" className="socialContainer whatsapp">
                                    <BiLogoWhatsapp />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}


