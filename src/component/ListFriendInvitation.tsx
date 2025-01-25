import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListFriendInvitation.module.css';
import { faHandshake } from '@fortawesome/free-regular-svg-icons';

const ListFriendInvitation = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faHandshake} size='lg' color='rgb(85, 85, 85)' />
                    <span>Lời mời kết bạn</span>
                </div>
            </div>
        </div>
    );
}

export default ListFriendInvitation;