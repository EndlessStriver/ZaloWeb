import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListFriend.module.css';
import { faArrowDownAZ, faEllipsis, faSearch, faSpinner, faUserTag, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import Friendship from '../interface/master-data/FriendShip';
import { getFriends } from '../service/FriendShipService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import AvtDefault from '../../public/images/avt_default.png';
import Account from '../interface/master-data/Account';

const ListFriend: React.FC = () => {

    const [friendShips, setFriendShips] = useState<Friendship[]>([]);
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const [loading, setLoading] = useState<boolean>(false);

    const { dispatch } = useContext(NotifyContext);

    useEffect(() => {
        const fetchFriendShips = async () => {
            try {
                setLoading(true);
                if (await MyJwtIsExpired()) {
                    dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                    return;
                }
                const listFriendShip = await getFriends();
                setFriendShips(listFriendShip);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (axios.isAxiosError(error) && error.response) {
                    dispatch({ type: "error", payload: error.response.data.message });
                } else {
                    dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                }
            }
        }
        fetchFriendShips();
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faUserTie} size='lg' color='rgb(85, 85, 85)' />
                    <span>Danh sách bạn bè</span>
                </div>
            </div>
            <div className={styles.body}>
                {
                    loading
                        ?
                        <div className={styles.loading}>
                            <FontAwesomeIcon icon={faSpinner} size='5x' color='#3498db' />
                            <span>Đang tải dữ liệu, vui lòng chờ...</span>
                        </div>
                        :
                        <>
                            {
                                friendShips.length === 0 ?
                                    <div className={styles.notFriends}>
                                        <FontAwesomeIcon icon={faUserTag} size='5x' color='#3498db' />
                                        <span>Thật tiếc, bạn chưa có người bạn nào</span>
                                    </div>
                                    :
                                    <>
                                        <span className={styles.lable}>Bạn bè ({friendShips.length})</span>
                                        <div className={styles.listFriend}>
                                            <div className={styles.header}>
                                                <div className={styles.search}>
                                                    <FontAwesomeIcon icon={faSearch} size='1x' color='rgb(85, 85, 85)' />
                                                    <input type="text" placeholder="Tìm kiếm bạn bè" />
                                                </div>
                                                <div className={styles.sort}>
                                                    <FontAwesomeIcon icon={faArrowDownAZ} size='1x' color='rgb(85, 85, 85)' />
                                                    <select>
                                                        <option value="1">(Tên) A-Z</option>
                                                        <option value="2">(Tên) Z-A</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {
                                                friendShips.map((friendShip) => (
                                                    <div key={friendShip.friendShipId} className={styles.friend}>
                                                        <div className={styles.info}>
                                                            <img src={
                                                                myUser.user.userId === friendShip.user.userId
                                                                    ? friendShip.friend.avatarUrl || AvtDefault
                                                                    : friendShip.user.avatarUrl || AvtDefault
                                                            } alt="avatar" />
                                                            <span className={styles.name}>
                                                                {
                                                                    myUser.user.userId === friendShip.user.userId
                                                                        ? `${friendShip.friend.firstName}  ${friendShip.friend.lastName}`
                                                                        : `${friendShip.user.firstName}  ${friendShip.user.lastName}`
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className={styles.action}>
                                                            <FontAwesomeIcon icon={faEllipsis} size='1x' color='rgb(85, 85, 85)' />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                            }
                        </>
                }
            </div>
        </div>
    );
}

export default ListFriend;