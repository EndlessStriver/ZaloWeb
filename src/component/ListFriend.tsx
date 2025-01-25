import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListFriend.module.css';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';

const ListFriend = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faUserTie} size='lg' color='rgb(85, 85, 85)' />
                    <span>Danh sách bạn bè</span>
                </div>
            </div>
        </div>
    );
}

export default ListFriend;