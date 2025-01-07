import React, { useContext, useEffect, useState } from 'react'
import styles from './formLogin.module.css'
import { Link, useNavigate } from 'react-router'
import { LoginApi } from '../service/AuthService'
import { MyJwtIsExpired } from '../util/MyJwtDecode'
import axios from 'axios'
import { NotifyContext } from '../context/NotifyContext'

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

    useEffect(() => {
        const checkTokenIsExpired = async () => {
            if (await MyJwtIsExpired() === false) navigate('/');
        }
        checkTokenIsExpired();
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const loginRequest = async () => {
            try {
                setLoading(true);
                const response = await LoginApi(account.username, account.password);
                localStorage.setItem('accessToken', response.accessToken);
                navigate('/');
                dispatch({ type: "success", payload: "Đăng nhập thành công" });
                setLoading(false);
            } catch (error) {
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
        loginRequest();
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={account.username}
                    onChange={(e) => {
                        setErrors({ ...errors, username: "" });
                        setAccount({ ...account, username: e.target.value })
                    }}
                />
                <span className={styles.globalError}>{errors.username}</span>
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={account.password}
                    onChange={(e) => {
                        setErrors({ ...errors, password: "" });
                        setAccount({ ...account, password: e.target.value })
                    }}
                />
                <span className={styles.globalError}>{errors.password}</span>
                <button disabled={loading} type='submit'>{loading ? "Đang xử lý..." : "Đăng nhập"}</button>
                <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
            </form>
        </div>
    );
}

export default FormLogin;