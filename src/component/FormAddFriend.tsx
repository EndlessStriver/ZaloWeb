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

interface FormAddFriendProps {
    isShow: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormAddFriend: React.FC<FormAddFriendProps> = (props) => {

    const navigate = useNavigate();
    const { dispatch } = useContext(NotifyContext);

    const [user, setUser] = useState<User | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
        setUser(null);
    }, [phoneNumber])

    const onSearch = async () => {
        if (await MyJwtIsExpired()) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
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
            if (!myUser) dispatch({ type: "info", payload: "Số điện thoại chưa được đăng kí, hoặc người dùng không tồn tại" });
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
                            <FontAwesomeIcon icon={faClipboard} size='2x' color='#bdc3c7' />
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
                                    <button>Kết bạn</button>
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