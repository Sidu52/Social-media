import React from 'react'
import { Outlet } from "react-router-dom";
import Topbar from './components/homebody/topbar/Topbar';
import Footer from "./pages/footer/Footer";
export default function HomeRoute() {
    return (
        <>
            <Topbar />
            <Outlet />
            <Footer />
        </>


    )
}
