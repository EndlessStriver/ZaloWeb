import React, { useEffect } from 'react'
import styles from './home.module.css'
import { faAddressBook, faComment, faUser } from '@fortawesome/free-regular-svg-icons';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Home: React.FC = () => {

    const [showMenuItem, setShowMenuItem] = React.useState<boolean>(false);
    const subMenuContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (subMenuContainerRef.current && !subMenuContainerRef.current.contains(event.target as Node)) {
                setShowMenuItem(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.avatar}></div>
                <div className={styles.menu}>
                    <div>
                        <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem} >
                            <FontAwesomeIcon icon={faComment} size='xl' color='white' />
                        </NavLink>
                        <NavLink to="/book-user" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem} >
                            <FontAwesomeIcon icon={faAddressBook} size='xl' color='white' />
                        </NavLink>
                    </div>
                    <div>
                        <div ref={subMenuContainerRef} className={`${styles.subMenuItemContainer} ${showMenuItem ? styles.hidden : null}`} >
                            <button>
                                <FontAwesomeIcon icon={faUser} size='lg' color='black' />
                                <span>Thông tin tài khoản</span>
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faGear} size='lg' color='black' />
                                <span>Cài đặt</span>
                            </button>
                            <hr />
                            <button>
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
    );
}

export default Home;