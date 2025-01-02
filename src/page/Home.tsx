import React from 'react'
import styles from './home.module.css'
import { faAddressBook, faComment } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Home: React.FC = () => {

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
                        <div className={styles.menuItem} >
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