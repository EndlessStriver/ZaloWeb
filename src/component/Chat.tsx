import { useContext, useEffect, useState } from 'react';
import ChatRoom from '../interface/master-data/ChatRoom';
import ChatItem from './ChatItem';
import styles from './chat.module.css'
import { getMyChatRooms } from '../service/ChatRoomService';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { useNavigate } from 'react-router';
import User from '../interface/master-data/User';

interface ChatProps {
    setRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const Chat: React.FC<ChatProps> = (props) => {

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getChatRooms = async () => {
            if (await MyJwtIsExpired() === true) {
                dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
                return;
            }
            try {
                setIsLoading(true);
                const response = await getMyChatRooms();
                setChatRooms(response);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                if (axios.isAxiosError(error) && error.response) {
                    dispatch({ type: "error", payload: error.response.data.message });
                } else {
                    dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                }
            }
        }
        getChatRooms();
    }, [])

    return (
        <div className={styles.chatContainer}>
            <div className={styles.navbar}>
                <button>Tất cả</button>
                <button>Chưa đọc</button>
            </div>
            <div className={styles.chat}>
                {
                    isLoading
                        ?
                        <div className={styles.loading}>
                            <FontAwesomeIcon icon={faSpinner} size="3x" color='#3498db' />
                            <p>Vui lòng chờ, đang tải dữ liệu...</p>
                        </div>
                        :
                        chatRooms.length === 0 ?
                            <div className={styles.noChat}>
                                <FontAwesomeIcon icon={faComments} size="3x" color='#3498db' />
                                <p>Không có tin nhắn nào...</p>
                            </div>
                            :
                            chatRooms.map((chatRoom, index) => {
                                return (
                                    <ChatItem
                                        key={index}
                                        chatRoom={chatRoom}
                                        setRoom={props.setRoom}
                                        setUser={props.setUser}
                                        setIsShowChatRoom={props.setIsShowChatRoom}
                                    />
                                )
                            })
                }
            </div>
        </div>
    )
}

export default Chat;