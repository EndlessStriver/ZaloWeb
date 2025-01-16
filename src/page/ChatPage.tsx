import React from 'react'
import styles from './chatPage.module.css'
import Chat from '../component/Chat';
import Search from '../component/Search';
import ResultSearch from '../component/ResultSearch';

const ChatPage: React.FC = () => {

    const [isFocusSearch, setIsFocusSearch] = React.useState<boolean>(false);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Search isForcusSearch={isFocusSearch} setIsFocusSearch={setIsFocusSearch} />
                {
                    !isFocusSearch ? <Chat /> : <ResultSearch />
                }
            </div>
            <div className={styles.content}>

            </div>
        </div>
    );
}

export default ChatPage;