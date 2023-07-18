import './Home.scss'
import Topbar from "../../components/homebody/topbar/Topbar";
import Sidebar from "../../components/homebody/sidebat/Sidebar";
import Rightbar from "../../components/homebody/rightbar/Rightbar";
import Feed from "../../components/homebody/feed/Feed";

export default function Home() {
    return (
        <div>
            <Topbar />
            <div className="homeContainer">
                <Sidebar />
                <Feed />
                <Rightbar />
            </div>

        </div>
    )
}
