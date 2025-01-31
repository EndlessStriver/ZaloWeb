import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './FormAddFriend.module.css';
import Overlay from './Overlay';
import { faSquarePhone, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { validatePhoneNumber } from '../util/ValidateForm';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import User from '../interface/master-data/User';
import { getByPhoneNumber } from '../service/UserService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { useNavigate } from 'react-router';
import { acceptFriendShip, addFriend, cancelFriendShip, getFriendTypeByPhoneNumber } from '../service/FriendShipService';
import { SocketContext } from '../context/SocketContext';

interface FormAddFriendProps {
    isShow: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormAddFriend: React.FC<FormAddFriendProps> = (props) => {

    const navigate = useNavigate();
    const { dispatch } = useContext(NotifyContext);
    const socket = useContext(SocketContext);

    const [user, setUser] = useState<User | null>(null);
    const [friendType, setFriendType] = useState<"NOT_FRIEND" | "FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "IS_YOU">("IS_YOU");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingAcceptFriend, setLoadingAcceptFriend] = useState(false);
    const [loadingCancelFriend, setLoadingCancelFriend] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
        setUser(null);
    }, [phoneNumber])

    const onSearch = async () => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
            return;
        }
        if (phoneNumber === "") {
            setError("Vui lòng nhập số điện thoại");
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setError("Số điện thoại không hợp lệ");
            return;
        }
        try {
            setLoading(true);
            const myUser = await getByPhoneNumber(phoneNumber);
            if (!myUser) {
                dispatch({ type: "info", payload: "Số điện thoại chưa được đăng kí, hoặc người dùng không tồn tại" });
                setLoading(false);
                return;
            }
            const myFriendType = await getFriendTypeByPhoneNumber(phoneNumber);
            setFriendType(myFriendType);
            setUser(myUser);
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

    const onAddFriend = async (friendId: string) => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
            return;
        }
        try {
            setLoadingAcceptFriend(true);
            await addFriend(friendId);
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
            navigate("/login");
            return;
        }
        try {
            setLoadingCancelFriend(true);
            await cancelFriendShip(friendId);
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
            navigate("/login");
            return;
        }
        try {
            setLoadingAcceptFriend(true);
            await acceptFriendShip(friendId);
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

    return (
        <Overlay>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>Thêm bạn</span>
                    <button onClick={() => props.setShow(false)}>
                        <FontAwesomeIcon icon={faXmark} size='xl' color='gray' />
                    </button>
                </div>
                <div className={styles.body}>
                    <div className={styles.inputContainer}>
                        <FontAwesomeIcon icon={faSquarePhone} size='2x' color='#3498db' />
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <span className={styles.error}>{error}</span>
                    {
                        !user &&
                        <div className={styles.noResult}>
                            <FontAwesomeIcon icon={faClipboard} size='3x' color='#bdc3c7' />
                            <span>Không có kết quả tìm kiếm</span>
                        </div>
                    }
                    {
                        user &&
                        <div className={styles.resultContainer}>
                            <span>Kết quả tìm kiếm</span>
                            <div className={styles.result}>
                                <div className={styles.resultItem}>
                                    <div className={styles.info}>
                                        <img src={user?.avatarUrl ? user.avatarUrl : "../public/images/avt_default.png"} alt="avatar" />
                                        <span>{user.firstName + " " + user.lastName}</span>
                                    </div>
                                    {
                                        friendType !== "IS_YOU" &&
                                        <div className={styles.action}>
                                            {
                                                friendType === "FRIEND" &&
                                                <button
                                                    className={styles.friend}
                                                    disabled
                                                >
                                                    Bạn bè
                                                </button>
                                            }
                                            {
                                                friendType === "NOT_FRIEND" &&
                                                <button
                                                    className={styles.send}
                                                    onClick={() => onAddFriend(user.userId)}
                                                    disabled={loadingAcceptFriend}
                                                >
                                                    {loadingAcceptFriend ? "Đang gửi..." : "Kết bạn"}
                                                </button>
                                            }
                                            {
                                                friendType === "REQUEST_SENT" &&
                                                <button
                                                    className={styles.cancel}
                                                    onClick={() => onCancelFriendShip(user.userId)}
                                                    disabled={loadingCancelFriend}
                                                >
                                                    {loadingCancelFriend ? "Đang hủy..." : "Hủy yêu cầu"}
                                                </button>
                                            }
                                            {
                                                friendType === "REQUEST_RECEIVED" &&
                                                <>
                                                    <button
                                                        className={styles.send}
                                                        onClick={() => onAcceptFriendShip(user.userId)}
                                                        disabled={loadingAcceptFriend}
                                                    >
                                                        {loadingAcceptFriend ? "Đang xử lý..." : "Chấp nhận"}
                                                    </button>
                                                    <button
                                                        className={styles.cancel}
                                                        onClick={() => onCancelFriendShip(user.userId)}
                                                        disabled={loadingCancelFriend}
                                                    >
                                                        {loadingCancelFriend ? "Đang hủy..." : "Từ chối"}
                                                    </button>
                                                </>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.footer}>
                    <button onClick={() => props.setShow(false)}>Hủy</button>
                    <button onClick={() => onSearch()} disabled={loading}>{loading ? "Đang tìm..." : "Tìm kiếm"}</button>
                </div>
            </div>
        </Overlay>
    )
}

export default FormAddFriend;