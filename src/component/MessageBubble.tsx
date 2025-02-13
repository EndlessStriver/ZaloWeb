import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Account from "../interface/master-data/Account";
import Message from "../interface/master-data/Message";
import { formatDateTimeChatBubble } from "../util/FunctionGlobal";
import styles from './messageBubble.module.css'
import { faFile } from "@fortawesome/free-solid-svg-icons";

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
                props.message.imageUrl &&
                <a
                    target="_blank"
                    href={props.message.imageUrl}
                    className={styles.image}>
                    <img src={props.message.imageUrl} alt="image" />
                </a>
            }
            {
                props.message.fileUrl &&
                <a
                    target="_blank"
                    href={props.message.fileUrl}
                    className={styles.file}>
                    <FontAwesomeIcon icon={faFile} />
                    <p>{props.message.fileName}</p>
                </a>
            }
            <p className={styles.timestamp}>{formatDateTimeChatBubble(props.message.timestamp)}</p>
        </div>
    )
}

export default MessageBubble;