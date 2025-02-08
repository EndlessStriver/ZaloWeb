import { useContext, useEffect, useState } from 'react';
import styles from './formForgotPassword.module.css'
import { ForgotPasswordApi, sendOtpAPI } from '../service/AuthService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ForgotPasswordRequest } from '../interface/api/AuthService';

const FormForgotPassword: React.FC = () => {

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ForgotPasswordRequest>({
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [count, setCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (count > 0) {
            const timerId = setTimeout(() => {
                setCount(preValue => preValue - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [count])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const sendOtpToEmail = async () => {
        try {
            setIsSending(true);
            await sendOtpAPI(formData.email);
            setCount(60);
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

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            if (!formData.email) {
                setErrors({
                    ...errors,
                    email: "Email không được để trống"
                });
                setIsLoading(false);
                return;
            }
            if (!formData.otp) {
                setErrors({
                    ...errors,
                    otp: "Mã OTP không được để trống"
                });
                setIsLoading(false);
                return;
            }
            if (!formData.password) {
                setErrors({
                    ...errors,
                    password: "Mật khẩu không được để trống"
                });
                setIsLoading(false);
                return;
            }
            if (formData.confirmPassword !== formData.password) {
                setErrors({
                    ...errors,
                    confirmPassword: "Mật khẩu không trùng khớp"
                });
                setIsLoading(false);
                return;
            }
            await ForgotPasswordApi(formData);
            dispatch({ type: "success", payload: "Đổi mật khẩu thành công" });
            navigate('/auth/login');
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
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
            <h1 className={styles.lable}>Quên mật khẩu</h1>
            <p className={styles.description}>Nhập email liên kết của bạn để lấy lại mật khẩu</p>
            <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <div className={styles.emailInputGroup}>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="Email liên kết"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <button
                            disabled={count > 0 || isSending}
                            onClick={sendOtpToEmail}
                            className={styles.button}
                            type="button"
                        >
                            {count > 0 ? count : isSending ? <FontAwesomeIcon icon={faEllipsis} /> : "Gửi"}
                        </button>
                    </div>
                    <p className={styles.error}>{errors.email}</p>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="otp">Mã OTP</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="otp"
                        placeholder="OTP"
                        value={formData.otp}
                        onChange={handleChange}
                    />
                    <p className={styles.error}>{errors.otp}</p>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="password"
                        placeholder="Mật khẩu mới"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <p className={styles.error}>{errors.password}</p>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <p className={styles.error}>{errors.confirmPassword}</p>
                </div>
                <button
                    className={styles.btnSubmit}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        </div>
    );
}

export default FormForgotPassword;