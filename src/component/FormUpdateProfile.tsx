import { useContext, useEffect, useState } from "react";
import { MyJwtIsExpired } from "../util/MyJwtDecode";
import { NotifyContext } from "../context/NotifyContext";
import { useNavigate } from "react-router";
import styles from './formUpdateProfile.module.css'
import Account from "../interface/master-data/Account";
import { updateProfileVerify } from "../service/UserService";
import axios from "axios";
import { UpdateProfileVerifyProps } from "../interface/api/UserService";

const FormUpdateProfile: React.FC = () => {

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const [formData, setFormData] = useState<UpdateProfileVerifyProps>({
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        phoneNumber: '',
        email: '',
    })
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        phoneNumber: '',
        email: '',
    })
    const [isLoading, setIsLoading] = useState(false);

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
        if (myUser) setFormData({
            ...formData,
            firstName: myUser.user.firstName,
            lastName: myUser.user.lastName,
            gender: myUser.user.gender,
            birthday: myUser.user.birthday,
            phoneNumber: myUser.user.phoneNumber,
            email: myUser.user.email
        });
    }, [])

    useEffect(() => {
        const checkSession = async () => {
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
            }
        }
        checkSession();
    }, []);

    const onUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            if (await MyJwtIsExpired()) {
                dispatch({ type: "error", payload: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
            }
            const response = await updateProfileVerify(formData);
            dispatch({ type: "success", payload: "Cập nhật thông tin tài khoản thành công" });
            localStorage.setItem("user", JSON.stringify({ ...myUser, user: response }));
            navigate('/');
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
            <h1>Thông tin tài khoản</h1>
            <form onSubmit={onUpload}>
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
                <div className={styles.btnGroup}>
                    <button
                        type="button"
                        className={styles.btnCancel}
                        disabled={isLoading}
                        onClick={() => navigate('/')}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className={styles.btnSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormUpdateProfile;