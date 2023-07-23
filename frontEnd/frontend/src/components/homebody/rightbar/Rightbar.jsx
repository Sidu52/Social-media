import './Rightbar.scss'
import FriendList from './FriendList';
export default function Rightbar() {
    return (
        <div className='rightbar'>
            <div className="rightWrapper">
                <div className="birthdayContainer">
                    <img className='birthdayImg' src="https://images.unsplash.com/photo-1496458590512-56d2688442b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="bithday img" />
                    <span className="birthdayText"> <b>Alex</b> and <b>3 other frinds</b> have a birthday..</span>
                </div>
                <iframe className='rightbarAd' src="https://www.youtube.com/embed/n3oo9U2etqM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    <FriendList />
                </ul>
            </div>
        </div>
    )
}
