import React, { useContext, useEffect, useState } from 'react'
import styles from './roomChat.module.css'
import AvtDefault from '../../public/images/avt_default.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faImage, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import User from '../interface/master-data/User'
import { ChatRoomGroup, ChatRoomSingle } from '../interface/master-data/ChatRoom'
import { createChatSingle, getChatRoomForUsers } from '../service/ChatRoomService'
import { SocketContext } from '../context/SocketContext'
import Account from '../interface/master-data/Account'
import { NotifyContext } from '../context/NotifyContext'
import axios from 'axios'
import { MyJwtIsExpired } from '../util/MyJwtDecode'
import { useNavigate } from 'react-router'

interface RoomChatProps {
    user: User | null;
    room: ChatRoomGroup | null;
}

const RoomChat: React.FC<RoomChatProps> = (props) => {

    const socket = useContext(SocketContext);
    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState<string[]>([]);
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const [messageSend, setMessageSend] = useState<string>("");
    const [roomInfo, setRoomInfo] = useState<ChatRoomGroup | ChatRoomSingle | null>(null);
    const [isCreateRoom, setIsCreateRoom] = useState<boolean>(false);

    useEffect(() => {
        if (socket && roomInfo !== null) {
            const subscription = socket.subscribe(`/private/chat/${roomInfo.chatRoomId}`, (response) => {
                setMessages(preVal => [...preVal, response.body]);
            });
            return () => subscription.unsubscribe();
        }
    }, [roomInfo, socket]);

    useEffect(() => {
        const getRoomInfo = async () => {
            try {
                if (await MyJwtIsExpired() === true) {
                    dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                    navigate("/login");
                    return;
                }
                if (props.user) {
                    const response = await getChatRoomForUsers(props.user.userId);
                    if (response) {
                        setIsCreateRoom(true);
                        setRoomInfo(response);
                    } else {
                        setIsCreateRoom(false);
                    }
                } else if (props.room) {
                    setIsCreateRoom(true);
                    setRoomInfo(props.room);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    dispatch({ type: "error", payload: error.response.data.message });
                } else {
                    dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                }
            }
        }
        getRoomInfo();
    }, [props.user, props.room, dispatch, navigate]);

    const onSendMessage = async () => {
        if (await MyJwtIsExpired() === true) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/login");
            return;
        }
        if (!messageSend) {
            dispatch({ type: "info", payload: "Vui lòng nhập nội dung tin nhắn" });
            return;
        }
        if (isCreateRoom === false) {
            if (props.user) {
                try {
                    const response = await createChatSingle(props.user.userId);
                    setIsCreateRoom(true);
                    setRoomInfo(response);
                    if (socket) socket.publish({ destination: "/app/chat/send", headers: { senderId: myUser.user.userId, chatRoomId: response.chatRoomId }, body: messageSend });
                    setMessageSend("");
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        dispatch({ type: "error", payload: error.response.data.message });
                    } else {
                        dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                    }
                }
            }
        } else {
            if (roomInfo && socket) {
                socket.publish({ destination: "/app/chat/send", headers: { senderId: myUser.user.userId, chatRoomId: roomInfo.chatRoomId }, body: messageSend });
                setMessageSend("");
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerLeftAvatar}>
                        <img src={AvtDefault} alt="avatar" />
                    </div>
                    <span className={styles.headerLeftName}>
                        {
                            props.user ? props.user.firstName + " " + props.user.lastName : props.room?.roomName

                        }
                    </span>
                </div>
            </div>
            <div className={styles.body}>
                {
                    messages.map((message, index) => (
                        <span key={index}>{message}</span>
                    ))
                }
            </div>
            <div className={styles.footer}>
                <div className={styles.header}>
                    <button>
                        <FontAwesomeIcon icon={faImage} size='xl' color="gray" />
                    </button>
                    <button>
                        <FontAwesomeIcon icon={faFile} size='xl' color="gray" />
                    </button>
                </div>
                <div className={styles.footer}>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn"
                        value={messageSend}
                        onChange={(e) => setMessageSend(e.target.value)}
                    />
                    <button
                        onClick={onSendMessage}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} size='xl' color="#3498db" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoomChat;