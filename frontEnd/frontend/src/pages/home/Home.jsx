import './Home.scss'
import Feed from "../../components/homebody/feed/Feed";
import Sidebar from "../../components/homebody/sidebar/Sidebar";
import Rightbar from "../../components/homebody/rightbar/Rightbar";
import { Outlet } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <div
                className="homeContainer"
            >
                <Sidebar />
                <Outlet />
                <Rightbar />
            </div>

        </div>
    )
}
