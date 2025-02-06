import { faHandshake } from "@fortawesome/free-regular-svg-icons";
import { faPeopleRoof, faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './groupAndFriend.module.css';
import { NavLink } from "react-router";

interface GroupAndFriendProps {
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const GroupAndFriend: React.FC<GroupAndFriendProps> = (props) => {

    return (
        <div className={styles.container}>
            <NavLink onClick={() => props.setIsShowChatRoom(false)} className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : `${styles.item}`} to={'friends'}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faUserTie} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Danh sách bạn bè</span>
            </NavLink>
            <NavLink onClick={() => props.setIsShowChatRoom(false)} className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : `${styles.item}`} to={'groups'}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faUsers} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Danh sách nhóm và cộng đồng</span>
            </NavLink>
            <NavLink onClick={() => props.setIsShowChatRoom(false)} className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : `${styles.item}`} to={'friend-invitation'}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faHandshake} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Lời mời kết bạn</span>
            </NavLink>
            <NavLink onClick={() => props.setIsShowChatRoom(false)} className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : `${styles.item}`} to={'invitation-community-group'}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faPeopleRoof} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Lời mời vào nhóm cộng đồng</span>
            </NavLink>
        </div>
    );
}

export default GroupAndFriend;