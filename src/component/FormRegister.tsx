import { Link, useNavigate } from 'react-router';
import styles from './formRegister.module.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { registerApi } from '../service/AuthService';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';

const FormRegister: React.FC = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        phoneNumber: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        phoneNumber: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
        setErrors({
            ...errors,
            [e.target.id]: ''
        })
    }

    useEffect(() => {
        const checkTokenIsExpired = async () => {
            if (await MyJwtIsExpired() === false) navigate('/');
        }
        checkTokenIsExpired();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            if (formData.password !== formData.confirmPassword) {
                setErrors({ ...errors, confirmPassword: "Mật khẩu không khớp" });
                setIsLoading(false);
                return;
            }
            await registerApi(formData);
            dispatch({ type: "success", payload: "Đăng kí thành công, vui lòng đăng nhập tài khoản để có thể sử dụng" });
            navigate('/auth/login');
            setIsLoading(false);
        } catch (error) {
            console.log(error);
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
            <h1>Đăng kí</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">Tên</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="firstName"
                            placeholder='Nhập tên của bạn'
                            onChange={handleChange}
                            value={formData.firstName}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.firstName}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="lastName">Họ</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="lastName"
                            placeholder='Nhập họ của bạn'
                            onChange={handleChange}
                            value={formData.lastName}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.lastName}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="gender">Giới tính</label>
                    <div className={styles.inputGroup}>
                        <select
                            id="gender"
                            onChange={handleChange}
                            value={formData.gender}
                            disabled={isLoading}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value={"MALE"}>Nam</option>
                            <option value={"FEMALE"}>Nữ</option>
                        </select>
                        <span className={styles.error}>{errors.gender}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="birthday">Ngày sinh</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="date"
                            id="birthday"
                            onChange={handleChange}
                            value={formData.birthday}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.birthday}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder='Nhập số điện thoại của bạn'
                            onChange={handleChange}
                            value={formData.phoneNumber}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.phoneNumber}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            id="email"
                            placeholder='Nhập email của bạn'
                            onChange={handleChange}
                            value={formData.email}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.email}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="username">Tên đăng nhập</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="username"
                            placeholder='Nhập tên đăng nhập'
                            onChange={handleChange}
                            value={formData.username}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.username}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Mật khẩu</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            id="password"
                            placeholder='Nhập mật khẩu'
                            onChange={handleChange}
                            value={formData.password}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.password}</span>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder='Nhập lại mật khẩu'
                            onChange={handleChange}
                            value={formData.confirmPassword}
                            disabled={isLoading}
                        />
                        <span className={styles.error}>{errors.confirmPassword}</span>
                    </div>
                </div>
                <button className={styles.submitBtn} disabled={isLoading} type="submit">{isLoading ? "Đang xử lý..." : "Đăng kí"}</button>
            </form>
            <Link to="/auth/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
    )
}

export default FormRegister;