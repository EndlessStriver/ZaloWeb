import React from 'react';
import styles from './loginRegisterPage.module.css'
import { Link, Outlet } from 'react-router';

const LoginRegisterPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <Link to="/">
                <h1><a className={styles.logo}></a></h1>
            </Link>
            <h2 className={styles.lable}>
                Đăng nhập tài khoản Zalo
                <br />
                Để kết nối với ứng dụng Zalo Web
            </h2>
            <Outlet />
        </div>
    );
}

export default LoginRegisterPage;