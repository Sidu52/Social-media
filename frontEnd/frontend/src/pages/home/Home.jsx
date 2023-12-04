import './Home.scss'
import Sidebar from "../../components/homebody/sidebar/Sidebar";
import Rightbar from "../../components/homebody/rightbar/Rightbar";
import { Outlet } from "react-router-dom";


export default function Home() {
    return (
        <div className='home_container h-screen grid gap-3 items-start max-[400px]:content-baseline content-baseline'>
            <Sidebar />
            <Outlet />
            <Rightbar />
        </div>
    )
}
