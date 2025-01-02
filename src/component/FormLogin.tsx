import React, { useState } from 'react'
import styles from './formLogin.module.css'
import { Link, useNavigate } from 'react-router'

interface Account {
    email: string
    password: string
}

const FormLogin: React.FC = () => {

    const navigate = useNavigate();
    const [account, setAccount] = useState<Account>({ email: "", password: "" })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate('/')
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Địa chỉ Email"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={account.password}
                    onChange={(e) => setAccount({ ...account, password: e.target.value })}
                />
                <button type='submit'>Đăng nhập</button>
                <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
            </form>
        </div>
    );
}

export default FormLogin;