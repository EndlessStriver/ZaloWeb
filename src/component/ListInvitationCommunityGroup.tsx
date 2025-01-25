import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListInvitationCommunityGroup.module.css';
import { faPeopleRoof } from '@fortawesome/free-solid-svg-icons';

const ListInvitationCommunityGroup = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faPeopleRoof} size='lg' color='rgb(85, 85, 85)' />
                    <span>Lời mời vào nhóm cộng đồng</span>
                </div>
            </div>
        </div>
    );
}

export default ListInvitationCommunityGroup;