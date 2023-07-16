import Users from '../../dummyData/rightUser';
export default function FriendList() {

    return (
        Users.map(user => {
            return (
                <>
                    <li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img className='rightbarProfileImg' src={user.profilePicture} alt="Profile" />
                            <span className='rightbarOnline'></span>
                        </div>

                        <span className="rightbarUserName">{user.username}</span>
                    </li>
                </>
            )
        })
    )
}
