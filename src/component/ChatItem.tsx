import styles from './chatitem.module.css'
import AvtDefault from '../../public/images/avt_default.png';
import ChatRoom from '../interface/master-data/ChatRoom';
import Account from '../interface/master-data/Account';
import User from '../interface/master-data/User';
import { formatDateTimeChatBubble } from '../util/FunctionGlobal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

interface ChatItemProps {
    chatRoom: ChatRoom;
    setRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatItem: React.FC<ChatItemProps> = (props) => {

    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);

    function getFullName(chatRoom: ChatRoom): string {
        if (chatRoom.roomName) return chatRoom.roomName;
        else {
            let fullName = "";
            chatRoom.userChatRooms.forEach((user) => {
                if (myUser.user.userId !== user.user.userId) fullName = `${user.user.firstName} ${user.user.lastName}`;
            });
            return fullName;
        }
    }

    function getFriendInSingleRoom(chatRoom: ChatRoom): User | null {
        for (const user of chatRoom.userChatRooms) {
            if (user.user.userId !== myUser.user.userId) return user.user;
        }
        return null;
    }

    return (
        <div
            className={styles.chatItem}
            onClick={() => {
                if (props.chatRoom.roomName) props.setRoom(props.chatRoom)
                else props.setUser(getFriendInSingleRoom(props.chatRoom));
                props.setIsShowChatRoom(true);
            }}
        >
            <div>
                <img src={props.chatRoom.roomImage ? props.chatRoom.roomImage : AvtDefault} />
            </div>
            <div className={styles.body}>
                <p className={styles.chatName}>{getFullName(props.chatRoom)}</p>
                {
                    props.chatRoom.newMessage?.content && <p className={styles.content}>{props.chatRoom.newMessage.content}</p>
                }
                {
                    props.chatRoom.newMessage?.imageUrl && <p className={styles.content}>
                        <FontAwesomeIcon icon={faImage} /> Hình ảnh
                    </p>
                }
            </div>
            <div className={styles.option}>
                {
                    props.chatRoom.newMessage && <p className={styles.timestamp}>{formatDateTimeChatBubble(props.chatRoom.newMessage?.timestamp)}</p>
                }
            </div>
        </div>
    );
}

export default ChatItem;