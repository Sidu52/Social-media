import React from "react";
import "./Form.scss";
import Navbar from '../../components/navbar/Navbar'
import { Outlet, Link } from "react-router-dom";

const Form = () => {
    return (
        <div>
            <Navbar />
            <div className="root-container">
                <div className="container">
                    <div className="sub-container">
                        <h1 className="title">Connect with Us</h1>
                        <article className="description">
                            Welcome to social chat. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Follow us for the latest updates, news, and exciting content. Don't miss out on any of our
                            posts!
                        </article>
                        <div className="dontaion__button btn">Upcoming</div>
                    </div>
                    <Outlet />
                </div>
                <div className='loginSingup' >
                    <Link className="link" to="signup">SignUp</Link>
                    <Link className="link" to="signin">SignIn</Link>
                </div>
            </div>
        </div>
    );
};

export default Form;
