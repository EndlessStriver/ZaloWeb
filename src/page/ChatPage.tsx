import React from 'react'
import styles from './chatPage.module.css'
import Chat from '../component/Chat';
import Search from '../component/Search';

const ChatPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Search />
                <Chat />
            </div>
            <div className={styles.content}>

            </div>
        </div>
    );
}

export default ChatPage;