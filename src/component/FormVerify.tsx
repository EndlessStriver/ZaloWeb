import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './formVerify.module.css'
import { faAngleUp, faArrowRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { LogoutApi, sendOtpAPI, verifyOtp } from '../service/AuthService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { useNavigate } from 'react-router';
import Account from '../interface/master-data/Account';
import avtDefault from '../../public/images/avt_default.png'

const FormVerify: React.FC = () => {

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const [formData, setFormData] = useState({
        email: "",
        otp: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        otp: ""
    });
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [countDown, setCountDown] = useState(0);
    const [isShowSubMenu, setIsShowSubMenu] = useState(false);
    const myMenu = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkSession = async () => {
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
            }
        }
        checkSession();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (countDown > 0) setCountDown(countDown - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [countDown]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (myMenu.current && !myMenu.current.contains(e.target as Node)) setIsShowSubMenu(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: ""
        });
    }

    const sendOtpToEmail = async () => {
        try {
            setIsSending(true);
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
                return;
            }
            await sendOtpAPI(formData.email);
            setCountDown(60);
            dispatch({ type: "success", payload: "Mã OTP đã được gửi tới Email của bạn" });
            setIsSending(false);
        } catch (error) {
            setIsSending(false);
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: "error", payload: error.response.data.message });
                if (error.response.data.errors) setErrors(error.response.data.errors);
            } else {
                dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
            }
        }
    }

    const verifyMyOtp = async () => {
        try {
            setIsVerifying(true);
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
                return;
            }
            await verifyOtp(formData);
            dispatch({ type: "success", payload: "Xác thực tài khoản thành công" });
            navigate("/");
            setIsVerifying(false);
        } catch (error) {
            setIsVerifying(false);
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: "error", payload: error.response.data.message });
                if (error.response.data.errors) setErrors(error.response.data.errors);
            } else {
                dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
            }
        }
    }

    const logout = async () => {
        try {
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
                return;
            }
            await LogoutApi();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            navigate('/auth/login');
            dispatch({ type: 'success', payload: 'Đăng xuất thành công' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: 'error', payload: error.response.data.message });
            } else {
                dispatch({ type: 'error', payload: 'Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối' });
            }
        }
    }


    return (
        <>
            <div
                ref={myMenu}
                onClick={() => setIsShowSubMenu(!isShowSubMenu)}
                className={styles.account}
            >
                <div className={styles.avatar}>
                    <img src={myUser.user.avatarUrl || avtDefault} alt="Ảnh đại diện" />
                    <p>{`${myUser.user.lastName} ${myUser.user.firstName}`}</p>
                </div>
                <div className={`${styles.icon} ${isShowSubMenu ? styles.active : styles.inActive}`}>
                    <FontAwesomeIcon icon={faAngleUp} />
                </div>
                <div className={`${styles.subMenu} ${isShowSubMenu ? styles.active : styles.inActive}`}>
                    <p
                        onClick={() => navigate('/auth/profile-update')}
                        className={styles.item}
                    >
                        Thông tin cá nhân
                    </p>
                    <p className={styles.item}>Đổi mật khẩu</p>
                    <p
                        onClick={logout}
                        className={styles.item}
                    >Đăng xuất</p>
                </div>
            </div>
            <div className={styles.container}>
                <h1 className={styles.lable}>Xác thực tài khoản</h1>
                <p className={styles.guide}>Nhập mã OTP được gửi tới địa chỉ Email của bạn để xác thực tài khoản</p>
                <div className={styles.emailGroup}>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email liên kết..."
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <button
                        disabled={isSending || countDown > 0}
                        onClick={sendOtpToEmail}
                        className={styles.btnSend}
                    >
                        {countDown > 0 ? countDown : isSending ? <FontAwesomeIcon icon={faEllipsis} /> : <FontAwesomeIcon icon={faArrowRight} />}
                    </button>
                </div>
                <p className={styles.error}>{errors.email}</p>
                <input
                    type="text"
                    name="otp"
                    placeholder="Mã OTP..."
                    value={formData.otp}
                    onChange={handleChange}
                />
                <p className={styles.error}>{errors.otp}</p>
                <button
                    onClick={verifyMyOtp}
                    className={styles.btnVerify}
                    disabled={formData.otp.length < 6}
                >
                    {isVerifying ? "Đang xác thực..." : "Xác thực"}
                </button>
            </div>
        </>
    );
}

export default FormVerify;