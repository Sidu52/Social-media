
import './Follow.scss';
import { RxCross2 } from 'react-icons/rx';

export default function Follow({ user, toggle, buttonType, handleChange, handleFollow }) {
    const locaaluser = JSON.parse(localStorage.getItem('Data'));
    const handleWindow = () => {
        handleChange(!toggle);
    };

    const handleUserProfile = (e, data) => {
        e.preventDefault();
        localStorage.setItem('userData', JSON.stringify(data));
        window.location.href = '../../../profile/post';
    }

    const handleFollowClick = (e, id, localId) => {

        e.stopPropagation(); // Prevent the click event from propagating to the parent div
        handleFollow(e, id, localId); // Call the handleFollow function in the parent component
    };
    return (
        <div className="follow__container" style={{ display: toggle ? 'flex' : 'none' }}>
            <div className="follow__card">
                <div className="follow__card2">
                    <div className="follow__head">
                        <p>{buttonType}</p>
                        <span onClick={handleWindow}>
                            <RxCross2 />
                        </span>
                    </div>
                    {user.map((data, index) => (
                        <div className="follow__user" key={index}>
                            <div onClick={((e) => { handleUserProfile(e, data) })}>
                                <img src={data.avatar} alt="pro" />
                                <p>{data.username}</p>
                            </div>
                            <button onClick={(e) => { handleFollowClick(e, data._id, locaaluser._id) }}>Follow</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


