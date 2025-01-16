import React from 'react'
import styles from './bookUserPage.module.css'
import Search from '../component/Search';
import GroupAndFriend from '../component/GroupAndFriend';

const BookUserPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Search />
                <GroupAndFriend />
            </div>
            <div className={styles.content}>

            </div>
        </div>
    );
}

export default BookUserPage;