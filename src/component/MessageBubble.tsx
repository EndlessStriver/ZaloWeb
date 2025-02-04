import Account from "../interface/master-data/Account";
import { TextMessage } from "../interface/master-data/Message";
import { formatDateTimeChatBubble } from "../util/FunctionGlobal";
import styles from './messageBubble.module.css'

interface MessageBubbleProps {
    message: TextMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = (props) => {

    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);

    return (
        <div className={`${props.message.user.userId === myUser.user.userId ? styles.myMessage : styles.friendMessage} ${styles.messageBubble}`}>
            <span className={styles.content}>{props.message.content}</span>
            <span className={styles.timestamp}>{formatDateTimeChatBubble(props.message.timestamp)}</span>
        </div>
    )
}

export default MessageBubble;