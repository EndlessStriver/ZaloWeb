import Account from "../interface/master-data/Account";
import Message from "../interface/master-data/Message";
import { formatDateTimeChatBubble } from "../util/FunctionGlobal";
import styles from './messageBubble.module.css'

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = (props) => {

    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);

    return (
        <div className={`${props.message.user.userId === myUser.user.userId ? styles.myMessage : styles.friendMessage} ${styles.messageBubble}`}>
            {
                props.message.content && <p className={styles.content}>{props.message.content}</p>
            }
            {
                props.message.imageUrl && <img src={props.message.imageUrl} alt="image" loading="lazy" className={styles.image} />
            }
            <p className={styles.timestamp}>{formatDateTimeChatBubble(props.message.timestamp)}</p>
        </div>
    )
}

export default MessageBubble;