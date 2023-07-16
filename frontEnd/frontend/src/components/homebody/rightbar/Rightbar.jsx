import './Rightbar.scss'
// import FrindList from './FriendList'

export default function Rightbar() {
    return (
        <div className='rightbar'>
            <div className="rightWrapper">
                <div className="birthdayContainer">
                    <img className='birthdayImg' src="https://images.unsplash.com/photo-1496458590512-56d2688442b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="bithday img" />
                    <span className="birthdayText"> <b>Alex</b> and <b>3 other frinds</b> have a birthday..</span>
                </div>
                <img className='rightbarAd' src="https://images.unsplash.com/photo-1496458590512-56d2688442b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Ad-img" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {/* <FrindList /> */}
                </ul>
            </div>
        </div>
    )
}
