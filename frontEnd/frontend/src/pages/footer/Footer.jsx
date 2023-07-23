
import './Footer.scss'
import { Link } from 'react-router-dom';
import { BiLogoLinkedin, BiLogoInstagram, } from 'react-icons/bi';

// Functional component for Footer page
export default function Footer() {
    return (
        <div>
            <footer>
                <div className="footer__content">
                    <div className="footer__top">
                        <div className="logo-details">
                            <span className="logo_name">Alston</span>
                        </div>
                        <div className="footer__media_icons">
                            <a target="on_blank" href="https://www.linkedin.com/in/siddhantsharma9/"><BiLogoLinkedin /></a>
                            <a target="on_blank" href="https://www.instagram.com/mrsharif_/"><BiLogoInstagram /></a>
                        </div>
                    </div>
                    <div className="footer__link_boxes">
                        <div className="first__box">
                            <ul className="box">
                                <li className="link_name">Links</li>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="">Vison</Link></li>

                            </ul>
                            <ul className="box">
                                <li className="link_name">Recommended</li>
                                <li><a href="{% url 'category' 6 %}">India</a></li>
                                <li><a href="{% url 'category' 5 %">Art and Culture</a></li>
                                <li><a href="{% url 'category' 11 %">People</a></li>
                                <li><a href="{% url 'category' 2 %">Travel</a></li>

                            </ul>
                        </div>
                        <div className="secound__box">
                            <ul className="box">
                                <li className="link_name">Legal Info</li>
                                <li><a href="/">Licence</a></li>
                                <li><a href="{% url 'terms' %}">Terms and Conditions</a></li>
                                <li><a href="{% url 'privacy' %}">Privacy Policies</a></li>

                            </ul>
                            <ul className="box">
                                <li className="link_name">Contact</li>
                                <li><a target="on_blank" href="tel:+919079680135">+91 8085984844</a></li>
                                <li><a target="on_blank" href="mailto:'siddhantsharma992@gmail.com'">siddhantsharma9926@gmail.com</a></li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div className="footer__bottom_details">
                    <div className="bottom__text">
                        <span className="copyright_text">Copyright © 2023 <a href="#">Alston.</a></span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
