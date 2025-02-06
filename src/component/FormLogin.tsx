import React, { useContext, useEffect, useState } from 'react'
import styles from './formLogin.module.css'
import { Link, useNavigate } from 'react-router'
import { LoginApi } from '../service/AuthService'
import { MyJwtIsExpired } from '../util/MyJwtDecode'
import axios from 'axios'
import { NotifyContext } from '../context/NotifyContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'

interface Account {
    username: string
    password: string
}

interface Errors {
    username: string
    password: string
}

const FormLogin: React.FC = () => {

    const navigate = useNavigate();
    const { dispatch } = useContext(NotifyContext);

    const [account, setAccount] = useState<Account>({ username: "", password: "" })
    const [errors, setErrors] = useState<Errors>({ username: "", password: "" });
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        const checkTokenIsExpired = async () => {
            if (await MyJwtIsExpired() === false) navigate('/');
        }
        checkTokenIsExpired();
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const loginRequest = async () => {
            if (await MyJwtIsExpired()) {
                try {
                    setLoading(true);
                    const response = await LoginApi(account.username, account.password);
                    localStorage.setItem('user', JSON.stringify(response));
                    localStorage.setItem('accessToken', response.accessToken);
                    navigate('/');
                    dispatch({ type: "success", payload: "Đăng nhập thành công" });
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    setAccount({ username: "", password: "" });
                    if (axios.isAxiosError(error) && error.response) {
                        dispatch({ type: "error", payload: error.response.data.message });
                        const myErrors = error.response.data.errors as Errors;
                        setErrors({ ...myErrors });
                    } else {
                        dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                    }
                }
            }
        }
        loginRequest();
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>
                        <FontAwesomeIcon icon={faUser} size='1x' />
                    </span>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={account.username}
                        onChange={(e) => {
                            setErrors({ ...errors, username: "" });
                            setAccount({ ...account, username: e.target.value })
                        }}
                    />
                </div>
                <span className={styles.globalError}>{errors.username}</span>
                <div className={styles.formGroup}>
                    <span>
                        <FontAwesomeIcon icon={faLock} size='1x' />
                    </span>
                    <input
                        type={`${showPassword ? "text" : "password"}`}
                        placeholder="Mật khẩu"
                        value={account.password}
                        onChange={(e) => {
                            setErrors({ ...errors, password: "" });
                            setAccount({ ...account, password: e.target.value })
                        }}
                    />
                    <button type='button' onClick={() => setShowPassword(!showPassword)} className={styles.buttonShowPassword}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <span className={styles.globalError}>{errors.password}</span>
                <button className={styles.buttonSubmit} disabled={loading} type='submit'>{loading ? "Đang xử lý..." : "Đăng nhập"}</button>
                <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
            </form>
            <Link to="/auth/register">Đăng ký tài khoản</Link>
        </div>
    );
}

export default FormLogin;