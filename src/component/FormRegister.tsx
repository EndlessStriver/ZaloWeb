import { Link } from 'react-router';
import styles from './formRegister.module.css'
import { useContext, useState } from 'react';
import axios from 'axios';
import { registerApi } from '../service/AuthService';
import { NotifyContext } from '../context/NotifyContext';

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

    const { dispatch } = useContext(NotifyContext);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                setErrors({ ...errors, confirmPassword: "Mật khẩu không khớp" });
                return;
            }
            const response = await registerApi(formData);
            console.log(response);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: "error", payload: error.response.data.message });
                setErrors(error.response.data.errors);
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
                        />
                        <span className={styles.error}>{errors.confirmPassword}</span>
                    </div>
                </div>
                <button className={styles.submitBtn} type="submit">Đăng kí</button>
            </form>
            <Link to="/auth/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
    )
}

export default FormRegister;