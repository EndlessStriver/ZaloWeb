import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './resultSearch.module.css';
import User from '../interface/master-data/User';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import AvtDefault from '../../public/images/avt_default.png';
import ChatRoom from '../interface/master-data/ChatRoom';
import Profile from './Profile';
import { useState } from 'react';
import Account from '../interface/master-data/Account';

interface ResultSearchProps {
    users: User[];
    rooms: ChatRoom[];
    isLoading: boolean;
    setRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultSearch: React.FC<ResultSearchProps> = (props) => {

    const [isShowProfile, setIsShowProfile] = useState(false);
    const [userSelect, setUserSelect] = useState<User | null>(null);
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);

    return (
        <div className={styles.container}>
            {
                props.users.length === 0 && props.rooms.length === 0 ?
                    <div className={styles.noResultSearch}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faLightbulb} size='4x' color="#74b9ff" />
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
                                        <div
                                            onClick={() => {
                                                if (user.userId === myUser.user.userId) {
                                                    setIsShowProfile(true);
                                                    setUserSelect(user);
                                                } else {
                                                    props.setUser(user);
                                                    props.setRoom(null);
                                                    props.setIsShowChatRoom(true);
                                                }
                                            }}
                                            key={user.userId}
                                            className={styles.item}
                                        >
                                            <img src={user.avatarUrl ? user.avatarUrl : AvtDefault} alt="avatar" />
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
                                        <div
                                            key={room.chatRoomId}
                                            className={styles.item}
                                            onClick={() => {
                                                props.setRoom(room);
                                                props.setUser(null);
                                                props.setIsShowChatRoom(true);
                                            }}
                                        >
                                            <img src={room.chatRoomId ? room.roomImage : AvtDefault} alt="avatar" />
                                            <span className={styles.itemName}>{room.roomName}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
            }
            {
                isShowProfile && userSelect &&
                <Profile
                    user={userSelect}
                    setIsShowProfile={setIsShowProfile}
                    setUser={setUserSelect}
                    setIsShowChatRoom={props.setIsShowChatRoom}
                    isShowProfile={isShowProfile}
                />
            }
        </div>
    )
}

export default ResultSearch;