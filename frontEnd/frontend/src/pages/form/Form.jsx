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
                        <h1 className="title">Hello This is title</h1>
                        <article className="description">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa culpa
                            nam recusandae alias inventore quae ratione ad dolorem, nobis
                            numquam repellendus vero temporibus accusanti!
                        </article>
                        <div className="dontaion__button btn">Donation</div>
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
