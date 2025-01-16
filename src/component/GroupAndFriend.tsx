import { faHandshake } from "@fortawesome/free-regular-svg-icons";
import { faPeopleRoof, faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './groupAndFriend.module.css';

const GroupAndFriend: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faUserTie} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Danh sách bạn bè</span>
            </div>
            <div className={styles.item}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faUsers} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Danh sách nhóm và cộng đồng</span>
            </div>
            <div className={styles.item}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faHandshake} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Lời mời kết bạn</span>
            </div>
            <div className={styles.item}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faPeopleRoof} size="lg" color="rgb(85, 85, 85)" />
                </div>
                <span className={styles.lable}>Lời mời vào nhóm cộng đồng</span>
            </div>
        </div>
    );
}

export default GroupAndFriend;