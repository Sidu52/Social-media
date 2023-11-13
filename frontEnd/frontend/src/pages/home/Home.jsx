import './Home.scss'
import Sidebar from "../../components/homebody/sidebar/Sidebar";
import Rightbar from "../../components/homebody/rightbar/Rightbar";
import { Outlet } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <div className='homeController h-[calc(99vh-50px)] overflow-y-scroll bg-white'>
                <Sidebar />
                <Outlet />
                <Rightbar />
            </div>
        </div >
    )
}
