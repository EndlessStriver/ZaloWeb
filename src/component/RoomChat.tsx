import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './roomChat.module.css'
import AvtDefault from '../../public/images/avt_default.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faImage, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import User from '../interface/master-data/User'
import ChatRoom from '../interface/master-data/ChatRoom'
import { createSingleChatRoom, getChatRoomForUsers } from '../service/ChatRoomService'
import { SocketContext } from '../context/SocketContext'
// import Account from '../interface/master-data/Account'
import { NotifyContext } from '../context/NotifyContext'
import axios from 'axios'
import { MyJwtIsExpired } from '../util/MyJwtDecode'
import { useNavigate } from 'react-router'
import Message from '../interface/master-data/Message'
import MessageBubble from './MessageBubble'
import { createFileMessage, createImageMessage, createTextMessage, getMessagesByChatRoomId } from '../service/MessageService'
import Profile from './Profile'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

interface RoomChatProps {
    user: User | null;
    room: ChatRoom | null;
    setIsShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const RoomChat: React.FC<RoomChatProps> = (props) => {

    const socket = useContext(SocketContext);
    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([]);
    // const myUser: Account = JSON.parse(localStorage.getItem("user") as string);
    const [messageSend, setMessageSend] = useState<string>("");
    const [roomInfo, setRoomInfo] = useState<ChatRoom>();
    const [isCreateRoom, setIsCreateRoom] = useState<boolean>(false);
    const myBody = useRef<HTMLDivElement>(null);
    const [pageOption, setPageOption] = useState({ currentPage: 0, totalPages: 10 });
    const [isLoadMessage, setIsLoadMessage] = useState<boolean>(false);
    const [isShowProfile, setIsShowProfile] = useState<boolean>(false);
    const [fileSelect, setFileSelect] = useState<File | null>(null);
    const [imageSelect, setImageSelect] = useState<File | null>(null);
    const [isSendImage, setIsSendImage] = useState<boolean>(false);
    const [isSendFile, setIsSendFile] = useState<boolean>(false);
    const refInputFileImage = useRef<HTMLInputElement>(null);
    const refInputFile = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (socket && roomInfo) {
            const subscription = socket.subscribe(`/private/chat/${roomInfo.chatRoomId}`, (response) => {
                const message: Message = JSON.parse(response.body);
                setMessages(preVal => [...preVal, message]);
            });
            return () => subscription.unsubscribe();
        }
    }, [roomInfo, socket]);

    useEffect(() => {
        const getRoomInfo = async () => {
            try {
                if (await MyJwtIsExpired() === true) {
                    dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                    navigate("/auth/login");
                    return;
                }
                if (props.user) {
                    const response = await getChatRoomForUsers(props.user.userId);
                    if (response) {
                        setIsCreateRoom(true);
                        setRoomInfo(response);
                    } else {
                        setIsCreateRoom(false);
                        setMessages([]);
                    }
                } else {
                    if (props.room) {
                        setIsCreateRoom(true);
                        setRoomInfo(props.room);
                    }
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
    }, [props.user, props.room]);

    useEffect(() => {
        const getMessageRoom = async () => {
            try {
                if (await MyJwtIsExpired() === true) {
                    dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                    navigate("/auth/login");
                    return;
                }
                if (roomInfo) {
                    setIsLoadMessage(true);
                    const response = await getMessagesByChatRoomId(roomInfo.chatRoomId, { orderBy: "desc", currentPage: 0 });
                    setPageOption({ currentPage: response.currentPage, totalPages: response.totalPages });
                    setMessages(response.data.reverse());
                    setIsLoadMessage(false);
                }
            } catch (error) {
                setIsLoadMessage(false);
                if (axios.isAxiosError(error) && error.response) {
                    dispatch({ type: "error", payload: error.response.data.message });
                } else {
                    dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                }
            }
        }

        if (roomInfo && isCreateRoom) getMessageRoom();

    }, [roomInfo, isCreateRoom]);

    useEffect(() => {
        if (imageSelect !== null && fileSelect === null) {
            const handleSendImage = async () => {
                try {
                    if (await MyJwtIsExpired() === true) {
                        dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                        navigate("/auth/login");
                        return;
                    }
                    if (!roomInfo || !isCreateRoom) {
                        if (props.user) {
                            setIsSendImage(true);
                            const response = await createSingleChatRoom(props.user.userId);
                            setIsCreateRoom(true);
                            setRoomInfo(response);
                            await createImageMessage(response.chatRoomId, imageSelect);
                            setImageSelect(null);
                            setIsSendImage(false);
                        }
                    } else {
                        setIsSendImage(true);
                        await createImageMessage(roomInfo.chatRoomId, imageSelect);
                        setImageSelect(null);
                        setIsSendImage(false);
                    }
                } catch (error) {
                    setImageSelect(null);
                    setIsSendImage(false);
                    if (axios.isAxiosError(error) && error.response) {
                        dispatch({ type: "error", payload: error.response.data.message });
                    } else {
                        dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                    }
                }
            }
            handleSendImage();
        }

        if (fileSelect !== null && imageSelect === null) {
            const handleSendImage = async () => {
                try {
                    if (await MyJwtIsExpired() === true) {
                        dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                        navigate("/auth/login");
                        return;
                    }
                    if (!roomInfo || !isCreateRoom) {
                        if (props.user) {
                            setIsSendFile(true);
                            const response = await createSingleChatRoom(props.user.userId);
                            setIsCreateRoom(true);
                            await createFileMessage(response.chatRoomId, fileSelect);
                            setFileSelect(null);
                            setIsSendFile(false);
                        }
                    } else {
                        setIsSendFile(true);
                        await createFileMessage(roomInfo.chatRoomId, fileSelect);
                        setFileSelect(null);
                        setIsSendFile(false);
                    }
                } catch (error) {
                    setIsSendFile(false);
                    setFileSelect(null);
                    if (axios.isAxiosError(error) && error.response) {
                        dispatch({ type: "error", payload: error.response.data.message });
                    } else {
                        dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                    }
                }
            }
            handleSendImage();
        }

    }, [imageSelect, fileSelect]);

    const onSendMessage = async () => {
        if (await MyJwtIsExpired() === true) {
            dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
            navigate("/auth/login");
            return;
        }
        if (!messageSend) {
            dispatch({ type: "info", payload: "Vui lòng nhập nội dung tin nhắn" });
            return;
        }
        if (isCreateRoom === false) {
            if (props.user) {
                try {
                    const response = await createSingleChatRoom(props.user.userId);
                    setIsCreateRoom(true);
                    setRoomInfo(response);
                    await createTextMessage(response.chatRoomId, messageSend);
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
                try {
                    await createTextMessage(roomInfo.chatRoomId, messageSend);
                    setMessageSend("");
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        dispatch({ type: "error", payload: error.response.data.message });
                    } else {
                        dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
                    }
                }
            }
        }
    }

    const loadMoreMessage = async () => {
        try {
            if (await MyJwtIsExpired() === true) {
                dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/auth/login");
                return;
            }
            if (roomInfo && pageOption.currentPage + 1 <= pageOption.totalPages) {
                setIsLoadMessage(true);
                const response = await getMessagesByChatRoomId(roomInfo.chatRoomId, { orderBy: "desc", currentPage: pageOption.currentPage + 1 });
                setPageOption({ currentPage: response.currentPage, totalPages: response.totalPages });
                setMessages([...response.data.reverse(), ...messages]);
                setIsLoadMessage(false);
            }
        } catch (error) {
            setIsLoadMessage(false);
            if (axios.isAxiosError(error) && error.response) {
                dispatch({ type: "error", payload: error.response.data.message });
            } else {
                dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') onSendMessage();
    };

    const scrollToTop = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (Math.abs(event.currentTarget.scrollTop) + event.currentTarget.clientHeight >= event.currentTarget.scrollHeight) {
            loadMoreMessage();
        }
    }

    const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.name === 'file') {
            setFileSelect(event.target.files[0]);
        }
        if (event.target.files && event.target.name === 'image') {
            setImageSelect(event.target.files[0]);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div
                    onClick={() => setIsShowProfile(true)}
                    className={styles.headerLeft}
                >
                    <img src={AvtDefault} alt="avatar" />
                    <span className={styles.headerLeftName}>
                        {
                            props.user ? props.user.firstName + " " + props.user.lastName : props.room?.roomName

                        }
                    </span>
                </div>
                {
                    isLoadMessage &&
                    <div className={styles.loadMoreMessage}>
                        <p>Đang tải tin nhắn...</p>
                    </div>
                }
                {
                    isSendImage &&
                    <div className={styles.sendingImage}>
                        <FontAwesomeIcon icon={faImage} size='lg' color="gray" />
                        <p>Đang gửi ảnh...</p>
                    </div>
                }
                {
                    isSendFile &&
                    <div className={styles.sendingFile}>
                        <FontAwesomeIcon icon={faFile} size='lg' color="gray" />
                        <p>Đang gửi file...</p>
                    </div>
                }
                {
                    <div className={styles.notFriend}>
                        <p className={styles.description}>
                            <FontAwesomeIcon icon={faUserPlus} size='lg' color="gray" />
                            Gửi yêu cầu kết bạn tới người ngày
                        </p>
                        <button>
                            Gửi kết bạn
                        </button>
                    </div>
                }
            </div>
            <div
                ref={myBody}
                className={styles.body}
                onScroll={scrollToTop}
            >
                {
                    messages.slice().reverse().map((message) => (
                        <MessageBubble key={message.messageId} message={message} />
                    ))
                }
            </div>
            <div className={styles.footer}>
                <div className={styles.header}>
                    <button
                        disabled={isSendImage}
                        onClick={() => {
                            if (refInputFileImage.current) refInputFileImage.current.click();
                        }}
                    >
                        <input
                            ref={refInputFileImage}
                            className={styles.inputFile}
                            type="file"
                            accept="image/*"
                            onChange={handleSelectFile}
                            name='image'
                        />
                        <FontAwesomeIcon icon={faImage} size='xl' color="gray" />
                    </button>
                    <button
                        disabled={isSendImage}
                        onClick={() => {
                            if (refInputFile.current) refInputFile.current.click();
                        }}
                    >
                        <input
                            ref={refInputFile}
                            className={styles.inputFile}
                            type="file"
                            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleSelectFile}
                            name='file'
                        />
                        <FontAwesomeIcon icon={faFile} size='xl' color="gray" />
                    </button>
                </div>
                <div className={styles.footer}>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn"
                        value={messageSend}
                        onChange={(e) => setMessageSend(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={onSendMessage}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} size='xl' color="#3498db" />
                    </button>
                </div>
            </div>
            {
                isShowProfile && props.user &&
                <Profile
                    user={props.user}
                    isShowProfile={isShowProfile}
                    setIsShowProfile={setIsShowProfile}
                    setIsShowChatRoom={props.setIsShowChatRoom}
                    setUser={props.setUser}
                />
            }
        </div>
    )
}

export default RoomChat;