import React from 'react';
import styles from './loginPage.module.css'
import FormLogin from '../component/FormLogin';

const LoginPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1><a className={styles.logo}></a></h1>
            <h2 className={styles.lable}>
                Đăng nhập tài khoản Zalo
                <br />
                Để kết nối với ứng dụng Zalo Web
            </h2>
            <FormLogin />
        </div>
    );
}

export default LoginPage;