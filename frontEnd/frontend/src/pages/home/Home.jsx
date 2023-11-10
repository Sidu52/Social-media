import './Home.scss'
import Feed from "../../components/homebody/feed/Feed";
import Sidebar from "../../components/homebody/sidebar/Sidebar";
import Rightbar from "../../components/homebody/rightbar/Rightbar";

export default function Home() {
    return (
        <div>
            <div className="homeContainer">
                <Sidebar />
                <Feed />
                <Rightbar />
            </div>

        </div>
    )
}
