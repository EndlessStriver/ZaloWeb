import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListGroup.module.css';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const ListGroup = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faUsers} size='lg' color='rgb(85, 85, 85)' />
                    <span>Danh sách nhóm và cộng đồng</span>
                </div>
            </div>
        </div>
    );
}

export default ListGroup;