import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ListFriendInvitation.module.css';
import { faHandshake } from '@fortawesome/free-regular-svg-icons';
import { useContext, useEffect, useState } from 'react';
import Friendship from '../interface/master-data/FriendShip';
import Account from '../interface/master-data/Account';
import { NotifyContext } from '../context/NotifyContext';
import { faHandshakeAngle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { acceptFriendShip, cancelFriendShip, getReceivedFriendRequests } from '../service/FriendShipService';
import AvtDefault from '../../public/images/avt_default.png';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { SocketContext } from '../context/SocketContext';

const ListFriendInvitation = () => {

    const [receivedFriendRequests, setReceivedFriendRequests] = useState<Friendship[]>([]);
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingAcceptFriend, setLoadingAcceptFriend] = useState(false);
    const [loadingCancelFriend, setLoadingCancelFriend] = useState(false);

    const { dispatch } = useContext(NotifyContext);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.subscribe(`/private/friend-request-cancel/${myUser.user.userId}`, (message) => {
                console.log("Received friend request cancel");
                setReceivedFriendRequests(
                    receivedFriendRequests.filter((friendShip) => (friendShip.user.userId === myUser.user.userId && friendShip.friend.userId === message.body)
                        || (friendShip.user.userId === message.body && friendShip.friend.userId === myUser.user.userId)
                    ));
            });
        }
    }, []);

    useEffect(() => {
        const fetchFriendShips = async () => {
            try {
                setLoading(true);
                if (await MyJwtIsExpired()) {
                    dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                    return;
                }
                const listReceivedFriendRequests = await getReceivedFriendRequests();
                setReceivedFriendRequests(listReceivedFriendRequests);
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

    const onAcceptFriendShip = async (friendId: string, friendShipId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
            return;
        }
        try {
            setLoadingAcceptFriend(true);
            await acceptFriendShip(friendId);
            setReceivedFriendRequests(receivedFriendRequests.filter((friendShip) => friendShip.friendShipId !== friendShipId));
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

    const onCancelFriendShip = async (friendId: string, friendShipId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
            return;
        }
        try {
            setLoadingCancelFriend(true);
            await cancelFriendShip(friendId);
            setReceivedFriendRequests(receivedFriendRequests.filter((friendShip) => friendShip.friendShipId !== friendShipId));
            setLoadingCancelFriend(false);
        } catch (error) {
            setLoadingCancelFriend(false);
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: "error", payload: error.response.data.message });
            } else {
                dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faHandshake} size='lg' color='rgb(85, 85, 85)' />
                    <span>Lời mời kết bạn</span>
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
                                receivedFriendRequests.length === 0 ?
                                    <div className={styles.notFriendInvitation}>
                                        <FontAwesomeIcon icon={faHandshakeAngle} size='5x' color='#3498db' />
                                        <span>Bạn không có lời mời kết bạn nào</span>
                                    </div>
                                    :
                                    <>
                                        <span className={styles.lable}>Lời mời kết bạn ({receivedFriendRequests.length})</span>
                                        <div className={styles.receivedFriendRequests}>
                                            {
                                                receivedFriendRequests.map((receivedFriendRequest) => (
                                                    <div key={receivedFriendRequest.friendShipId} className={styles.receivedFriendRequest}>
                                                        <div className={styles.info}>
                                                            <img src={
                                                                myUser.user.userId === receivedFriendRequest.user.userId
                                                                    ? receivedFriendRequest.friend.avatarUrl || AvtDefault
                                                                    : receivedFriendRequest.user.avatarUrl || AvtDefault
                                                            } alt="avatar" />
                                                            <span className={styles.name}>
                                                                {
                                                                    myUser.user.userId === receivedFriendRequest.user.userId
                                                                        ? `${receivedFriendRequest.friend.firstName}  ${receivedFriendRequest.friend.lastName}`
                                                                        : `${receivedFriendRequest.user.firstName}  ${receivedFriendRequest.user.lastName}`
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className={styles.action}>
                                                            <button
                                                                className={styles.accept}
                                                                onClick={() => onAcceptFriendShip(myUser.user.userId === receivedFriendRequest.user.userId ? receivedFriendRequest.friend.userId : receivedFriendRequest.user.userId, receivedFriendRequest.friendShipId)}
                                                                disabled={loadingAcceptFriend}
                                                            >
                                                                {loadingAcceptFriend ? "Đang xử lý..." : "Chấp nhận"}
                                                            </button>
                                                            <button
                                                                className={styles.decline}
                                                                onClick={() => onCancelFriendShip(myUser.user.userId === receivedFriendRequest.user.userId ? receivedFriendRequest.friend.userId : receivedFriendRequest.user.userId, receivedFriendRequest.friendShipId)}
                                                                disabled={loadingCancelFriend}
                                                            >
                                                                {loadingCancelFriend ? "Đang xử lý..." : "Từ chối"}
                                                            </button>
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

export default ListFriendInvitation;