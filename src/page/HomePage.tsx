import React, { useContext, useEffect } from 'react'
import styles from './homePage.module.css'
import { faAddressBook, faComment, faUser } from '@fortawesome/free-regular-svg-icons';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { LogoutApi } from '../service/AuthService';
import { NotifyContext } from '../context/NotifyContext';
import axios from 'axios';
import SocketProvider from '../context/SocketContext';

const HomePage: React.FC = () => {

    const navigate = useNavigate();
    const { dispatch } = useContext(NotifyContext);
    const [showMenuItem, setShowMenuItem] = React.useState<boolean>(false);
    const subMenuContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkTokenIsExpired = async () => {
            if (await MyJwtIsExpired()) {
                navigate('/login');
                dispatch({ type: 'error', payload: 'Phiên đăng nhập đã hết hạn' });
            }
        }
        checkTokenIsExpired();
    }, [navigate, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (subMenuContainerRef.current && !subMenuContainerRef.current.contains(event.target as Node)) {
                setShowMenuItem(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = async () => {
        try {
            await LogoutApi();
            localStorage.removeItem('accessToken');
            navigate('/login');
            dispatch({ type: 'success', payload: 'Đăng xuất thành công' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: 'error', payload: error.response.data.message });
            } else {
                dispatch({ type: 'error', payload: 'Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối' });
            }
        }
    }

    return (
        <SocketProvider>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.avatar}></div>
                    <div className={styles.menu}>
                        <div>
                            <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem} >
                                <FontAwesomeIcon icon={faComment} size='xl' color='white' />
                            </NavLink>
                            <NavLink to="/book-user-group" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem} >
                                <FontAwesomeIcon icon={faAddressBook} size='xl' color='white' />
                            </NavLink>
                        </div>
                        <div>
                            <div ref={subMenuContainerRef} className={`${styles.subMenuItemContainer} ${!showMenuItem ? styles.hidden : null}`} >
                                <button>
                                    <FontAwesomeIcon icon={faUser} size='lg' color='black' />
                                    <span>Thông tin tài khoản</span>
                                </button>
                                <button>
                                    <FontAwesomeIcon icon={faGear} size='lg' color='black' />
                                    <span>Cài đặt</span>
                                </button>
                                <hr />
                                <button onClick={logout} >
                                    <FontAwesomeIcon icon={faRightFromBracket} size='lg' color='red' />
                                    <span>Đăng xuất </span>
                                </button>
                            </div>
                            <div className={`${styles.menuItem} ${showMenuItem ? styles.active : null}`} onClick={() => setShowMenuItem(!showMenuItem)} >
                                <FontAwesomeIcon icon={faGear} size='xl' color='white' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.main}>
                    <Outlet />
                </div>
            </div>
        </SocketProvider>
    );
}

export default HomePage;