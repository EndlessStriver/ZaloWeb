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
import { useNavigate, useOutletContext } from 'react-router';
import User from '../interface/master-data/User';
import Profile from './Profile';

interface FriendProps {
    setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
    setIsShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
    showProfile: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
    friendShips: Friendship[];
    setFriendShips: React.Dispatch<React.SetStateAction<Friendship[]>>;
    friendShip: Friendship;
}

const ListFriend: React.FC = () => {

    const [friendShips, setFriendShips] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isShowProfile, setIsShowProfile] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<User | null>(null);

    const { dispatch } = useContext(NotifyContext);

    const { setUser, setIsShowChatRoom }: {
        setUser: React.Dispatch<React.SetStateAction<User | null>>,
        setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>
    } = useOutletContext();

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
                                                        setIsShowProfile={setIsShowProfile}
                                                        showProfile={isShowProfile}
                                                        friendShip={friendShip}
                                                        friendShips={friendShips}
                                                        setFriendShips={setFriendShips}
                                                        setIsShowChatRoom={setIsShowChatRoom}
                                                        setUser={setUser}
                                                        setUserProfile={setUserProfile}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </>
                            }
                        </>
                }
            </div>
            {
                isShowProfile && userProfile &&
                <Profile
                    user={userProfile}
                    isShowProfile={isShowProfile}
                    setIsShowProfile={setIsShowProfile}
                    setIsShowChatRoom={setIsShowChatRoom}
                    setUser={setUser}
                />
            }
        </div>
    );
}

const Friend: React.FC<FriendProps> = (props) => {

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
            props.setFriendShips(props.friendShips.filter(f => f.friendShipId !== friendShipId));
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

    const onShowProfile = () => {
        props.setUserProfile(myUser.user.userId === props.friendShip.user.userId ? props.friendShip.friend : props.friendShip.user);
        props.setIsShowProfile(true);
    }

    return (
        <div className={styles.friend} >
            <div
                onClick={onShowProfile}
                className={styles.info}
            >
                <img src={
                    myUser.user.userId === props.friendShip.user.userId
                        ? props.friendShip.friend.avatarUrl || AvtDefault
                        : props.friendShip.user.avatarUrl || AvtDefault
                } alt="avatar" />
                <span className={styles.name}>
                    {
                        myUser.user.userId === props.friendShip.user.userId
                            ? `${props.friendShip.friend.firstName}  ${props.friendShip.friend.lastName}`
                            : `${props.friendShip.user.firstName}  ${props.friendShip.user.lastName}`
                    }
                </span>
            </div>
            <div ref={subMenuContainerRef} className={styles.action} onClick={() => setShowSubMenu(true)}>
                <FontAwesomeIcon icon={faEllipsis} size='1x' color='rgb(85, 85, 85)' />
                {
                    showSubMenu ?
                        <div className={styles.subMenu}>
                            <div
                                className={styles.item}
                                onClick={() => {
                                    props.setUser(myUser.user.userId === props.friendShip.user.userId ? props.friendShip.friend : props.friendShip.user);
                                    props.setIsShowChatRoom(true);
                                }}
                            >
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
                                onClick={() => onCancelFriendShip(myUser.user.userId === props.friendShip.user.userId ? props.friendShip.friend.userId : props.friendShip.user.userId, props.friendShip.friendShipId)}
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