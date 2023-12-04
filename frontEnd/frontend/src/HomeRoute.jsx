import React from 'react'
import { Outlet } from "react-router-dom";

import Footer from "./pages/footer/Footer";
export default function HomeRoute() {
    return (
        <div>
            {/* <Topbar /> */}
            <Outlet />
            {/* <Footer /> */}
        </div>


    )
}
