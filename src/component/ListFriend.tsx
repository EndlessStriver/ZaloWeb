import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListFriend.module.css';
import { faArrowDownAZ, faClose, faEllipsis, faSearch, faSpinner, faUserTag, faUserTie } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react';
import Friendship from '../interface/master-data/FriendShip';
import { cancelFriendship, getFriendList } from '../service/FriendShipService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import AvtDefault from '../../public/images/avt_default.png';
import Account from '../interface/master-data/Account';
import Overlay from './Overlay';
import { useNavigate } from 'react-router';

interface FriendProps {
    friendShips: Friendship[];
    setFriendShips: React.Dispatch<React.SetStateAction<Friendship[]>>;
    friendShip: Friendship;
}

const ListFriend: React.FC = () => {

    const [friendShips, setFriendShips] = useState<Friendship[]>([]);
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
                const listFriendShip = await getFriendList();
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
                                                    <Friend
                                                        key={friendShip.friendShipId}
                                                        friendShip={friendShip}
                                                        friendShips={friendShips}
                                                        setFriendShips={setFriendShips}
                                                    />
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

const Friend: React.FC<FriendProps> = ({ friendShip, friendShips, setFriendShips }) => {

    const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const subMenuContainerRef = React.useRef<HTMLDivElement>(null);
    const [loadingAcceptFriend, setLoadingAcceptFriend] = useState(false);

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (subMenuContainerRef.current && !subMenuContainerRef.current.contains(event.target as Node)) {
                setShowSubMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onCancelFriendShip = async (friendId: string, friendShipId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
            return;
        }
        try {
            setLoadingAcceptFriend(true);
            await cancelFriendship(friendId);
            dispatch({ type: "success", payload: "Xóa bạn bè thành công" });
            setShowModalDelete(false);
            setFriendShips(friendShips.filter(f => f.friendShipId !== friendShipId));
            setLoadingAcceptFriend(false);
        } catch (error) {
            setLoadingAcceptFriend(false);
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: "error", payload: error.response.data.message });
            } else {
                dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
            }
        }
    }

    return (
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
            <div ref={subMenuContainerRef} className={styles.action} onClick={() => setShowSubMenu(true)}>
                <FontAwesomeIcon icon={faEllipsis} size='1x' color='rgb(85, 85, 85)' />
                {
                    showSubMenu ?
                        <div className={styles.subMenu}>
                            <div className={styles.item}>
                                <span>Trò chuyện</span>
                            </div>
                            <div className={styles.item}>
                                <span>Chặn</span>
                            </div>
                            <div
                                onClick={() => setShowModalDelete(true)}
                                className={styles.item}
                            >
                                <span>Xóa bạn</span>
                            </div>
                        </div>
                        : null
                }
            </div>
            {
                showModalDelete &&
                <Overlay>
                    <div className={styles.modalDelete}>
                        <div className={styles.headerModal}>
                            <span>Xác nhận</span>
                            <button onClick={() => setShowModalDelete(false)}>
                                <FontAwesomeIcon icon={faClose} size='xl' color='rgb(85, 85, 85)' />
                            </button>
                        </div>
                        <div className={styles.body}>
                            <span>Bạn có chắc chắn muốn xóa người này ra khỏi danh sách bạn bè không?</span>
                        </div>
                        <div className={styles.footer}>
                            <button
                                className={styles.cancel}
                                onClick={() => setShowModalDelete(false)}
                                disabled={loadingAcceptFriend}
                            >
                                Không
                            </button>
                            <button
                                onClick={() => onCancelFriendShip(myUser.user.userId === friendShip.user.userId ? friendShip.friend.userId : friendShip.user.userId, friendShip.friendShipId)}
                                className={styles.confirm}
                                disabled={loadingAcceptFriend}
                            >
                                {loadingAcceptFriend ? "Đang xử lý..." : "Xóa"}
                            </button>
                        </div>
                    </div>
                </Overlay>
            }
        </div>
    );
}


export default ListFriend;