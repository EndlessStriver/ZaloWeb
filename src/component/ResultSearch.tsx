import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './resultSearch.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import User from '../interface/master-data/User';
import { ChatRoomGroup } from '../interface/master-data/ChatRoom';

interface ResultSearchProps {
    users: User[];
    rooms: ChatRoomGroup[];
    isLoading: boolean;
}

const ResultSearch: React.FC<ResultSearchProps> = (props) => {
    return (
        <div className={styles.container}>
            {
                props.users.length === 0 && props.rooms.length === 0 ?
                    <div className={styles.noResultSearch}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faSearch} size='3x' color="#74b9ff" />
                        </div>
                        <span className={styles.lable}>Chưa có kết quả tìm kiếm?</span>
                    </div>
                    :
                    <div className={styles.resultSearch}>
                        {
                            props.users.length > 0 &&
                            <div className={styles.itemContainer}>
                                <span className={styles.lable}>Người dùng {`(${props.users.length})`}</span>
                                {
                                    props.users.map((user) => (
                                        <div key={user.userId} className={styles.item}>
                                            <img src={user.avatarUrl ? user.avatarUrl : `./public/images/avt_default.png`} alt="avatar" />
                                            <span className={styles.itemName}>{user.firstName + " " + user.lastName}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                        {
                            props.rooms.length > 0 &&
                            <div className={styles.itemContainer}>
                                <span className={styles.lable}>Nhóm {`(${props.rooms.length})`}</span>
                                {
                                    props.rooms.map((room) => (
                                        <div key={room.chatRoomId} className={styles.item}>
                                            <img src={room.chatRoomId ? room.roomImage : `./public/images/avt_default.png`} alt="avatar" />
                                            <span className={styles.itemName}>{room.roomName}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
            }
        </div>
    )
}

export default ResultSearch;