import styles from './chatitem.module.css'

const ChatItem: React.FC = () => {
    return (
        <div className={styles.chatItem}>
            <div>
                <img src="./public/images/avt_default.png" />
            </div>
            <div>
                <p className={styles.chatName}>Nhóm KLTN IUH 2024</p>
                <p className={styles.chatMessage}>mai lên báo cáo khóa luận không này ?</p>
            </div>
        </div>
    );
}

export default ChatItem;