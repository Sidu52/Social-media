import Users from '../../../dummyData/leftUserData';
export default function friend() {
    return(
        Users.map(user => {
            return (
                <>
                    <li className="sidebarFriend">
                        <img src={user.profilePicture} alt="" className="sidebarFrindImg" />
                        <span className="sidebarFrindName">{user.username}</span>
                    </li>
                </>
            )
        }
            
        )
    )

    
}
