import ChatItem from './ChatItem';
import styles from './chat.module.css'

const Chat: React.FC = () => {
    return (
        <div className={styles.chatContainer}>
            <div className={styles.navbar}>
                <button>Tất cả</button>
                <button>Chưa đọc</button>
            </div>
            <div className={styles.chat}>
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
            </div>
        </div>
    )
}

export default Chat;