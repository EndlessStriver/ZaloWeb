import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './formVerify.module.css'
import { faArrowRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { sendOtpAPI } from '../service/AuthService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';

const FormVerify: React.FC = () => {

    const { dispatch } = useContext(NotifyContext);

    const [formData, setFormData] = useState({
        email: "",
        otp: ""
    });
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        otp: ""
    });
    const [countDown, setCountDown] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (countDown > 0) setCountDown(countDown - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [countDown]);


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
            if (await MyJwtIsExpired()) return dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
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


    return (
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
                    onClick={() => sendOtpToEmail()}
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
            />
            <button
                className={styles.btnVerify}
                disabled={formData.otp.length < 6}
            >
                Xác thực
            </button>
        </div>
    );
}

export default FormVerify;