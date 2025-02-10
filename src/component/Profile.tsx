import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Overlay from './Overlay';
import styles from './profile.module.css'
import { faClose } from '@fortawesome/free-solid-svg-icons';
import defaultBG from '../../public/images/bg-default.jpg';
import avtDefault from '../../public/images/avt_default.png';
import User from '../interface/master-data/User';
import { formatDate } from '../util/FunctionGlobal';
import { useContext, useEffect, useState } from 'react';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { useNavigate } from 'react-router';
import { NotifyContext } from '../context/NotifyContext';
import { acceptFriendRequest, cancelFriendship, checkFriendshipByFriendId, sendFriendRequest } from '../service/FriendShipService';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';

interface ProfileProps {
    user: User;
    isShowProfile: boolean;
    setIsShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
    setIsShowFormAddFriend?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profile: React.FC<ProfileProps> = (props) => {

    const navigate = useNavigate();
    const { dispatch } = useContext(NotifyContext);
    const socket = useContext(SocketContext);

    const [loading, setLoading] = useState(false);
    const [loadingAcceptFriend, setLoadingAcceptFriend] = useState(false);
    const [loadingCancelFriend, setLoadingCancelFriend] = useState(false);
    const [friendType, setFriendType] = useState<"NOT_FRIEND" | "FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "IS_YOU">("IS_YOU");

    useEffect(() => {
        const checkFriendShip = async () => {
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
                return;
            }
            try {
                setLoading(true);
                const myFriendType = await checkFriendshipByFriendId(props.user.userId);
                setFriendType(myFriendType);
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
        checkFriendShip();
    }, [props.user.userId]);

    const onAddFriend = async (friendId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/auth/login");
            return;
        }
        try {
            setLoadingAcceptFriend(true);
            await sendFriendRequest(friendId);
            setFriendType("REQUEST_SENT");
            if (socket) socket.publish({ destination: `/app/friend-request/send`, headers: { receiveId: friendId } });
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

    const onCancelFriendShip = async (friendId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/auth/login");
            return;
        }
        try {
            setLoadingCancelFriend(true);
            await cancelFriendship(friendId);
            setFriendType("NOT_FRIEND");
            if (socket) socket.publish({ destination: `/app/friend-request/cancel`, headers: { receiveId: friendId } });
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

    const onAcceptFriendShip = async (friendId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/auth/login");
            return;
        }
        try {
            setLoadingAcceptFriend(true);
            await acceptFriendRequest(friendId);
            setFriendType("FRIEND");
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

    const onShowChatRoom = () => {
        props.setUser(props.user);
        props.setIsShowChatRoom(true);
        props.setIsShowProfile(false);
        if (props.setIsShowFormAddFriend) props.setIsShowFormAddFriend(false);
    }

    return (
        <Overlay>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p>Thông tin tài khoản</p>
                    <button onClick={() => {
                        props.setIsShowProfile(false);
                    }}>
                        <FontAwesomeIcon icon={faClose} color='gray' size='2x' />
                    </button>
                </div>
                <div className={styles.background}>
                    <img src={defaultBG} alt='background' />
                </div>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        <img src={props.user.avatarUrl || avtDefault} alt='avatar' />
                    </div>
                    <p className={styles.fullName}>
                        {`${props.user.firstName} ${props.user.lastName}`}
                    </p>
                </div>
                {
                    friendType !== "IS_YOU" &&
                    <div className={styles.option}>
                        {
                            friendType === "NOT_FRIEND" &&
                            <button
                                onClick={() => onAddFriend(props.user.userId)}
                                disabled={loadingAcceptFriend}
                                className={styles.addFriend}
                            >
                                {loadingAcceptFriend ? "Đang gửi..." : "Kết bạn"}
                            </button>
                        }
                        {
                            friendType === "REQUEST_SENT" &&
                            <button
                                onClick={() => onCancelFriendShip(props.user.userId)}
                                disabled={loadingCancelFriend}
                                className={styles.cancelFriend}
                            >
                                {loadingCancelFriend ? "Đang hủy..." : "Hủy yêu cầu"}
                            </button>
                        }
                        {
                            friendType === "REQUEST_RECEIVED" &&
                            <button
                                onClick={() => onAcceptFriendShip(props.user.userId)}
                                disabled={loadingAcceptFriend}
                                className={styles.acceptFriend}
                            >
                                {loadingAcceptFriend ? "Đang xử lý..." : "Chấp nhận"}
                            </button>
                        }
                        <button
                            onClick={onShowChatRoom}
                            className={styles.chat}
                        >
                            Nhắn tin
                        </button>
                    </div>
                }
                <div className={styles.detail}>
                    <p className={styles.lable}>Thông tin cá nhân</p>
                    <div className={styles.content}>
                        <p>Giới tính: {props.user.gender === "MALE" ? "Nam" : "Nữ"}</p>
                        <p>Ngày sinh: {formatDate(props.user.birthday)}</p>
                        <p>Email: {props.user.email}</p>
                        <p>Số điện thoại: {props.user.phoneNumber}</p>
                    </div>
                </div>
            </div>
        </Overlay>
    );
}

export default Profile;