import React, { useContext, useEffect, useState } from 'react'
import styles from './chatPage.module.css'
import Chat from '../component/Chat';
import Search from '../component/Search';
import ResultSearch from '../component/ResultSearch';
import { getFriendsAndMessageContacts, getUserByPhoneNumber } from '../service/UserService';
import { getChatRoomsByRoomNameAndUserId } from '../service/ChatRoomService';
import User from '../interface/master-data/User';
import axios from 'axios';
import { NotifyContext } from '../context/NotifyContext';
import { validatePhoneNumber } from '../util/ValidateForm';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import FormAddFriend from '../component/FormAddFriend';
import { useNavigate } from 'react-router';
import RoomChat from '../component/RoomChat';
import ChatRoom from '../interface/master-data/ChatRoom';

const ChatPage: React.FC = () => {

    const [keyword, setKeyword] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [isFocusSearch, setIsFocusSearch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShowFormAddFriend, setIsShowFormAddFriend] = useState<boolean>(false);
    const [isShowChatRoom, setIsShowChatRoom] = useState<boolean>(false);

    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const { dispatch } = useContext(NotifyContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (room || user) setIsShowChatRoom(true);
        if (!room && !user) setIsShowChatRoom(false);
    }, [room, user])

    useEffect(() => {
        if (!isFocusSearch) {
            setKeyword('');
            setUsers([]);
            setRooms([]);
        }
    }, [isFocusSearch])

    useEffect(() => {
        const id = setTimeout(async () => {
            if (await MyJwtIsExpired() === true) {
                dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
                navigate("/login");
                return;
            }
            if (keyword) {
                try {
                    setIsLoading(true);
                    if (!validatePhoneNumber(keyword)) {
                        const [listFriend, listRoom] = await Promise.all([getFriendsAndMessageContacts(keyword), getChatRoomsByRoomNameAndUserId(keyword)])
                        setUsers(listFriend);
                        setRooms(listRoom);
                    }
                    if (validatePhoneNumber(keyword)) {
                        const user = await getUserByPhoneNumber(keyword);
                        if (user) setUsers([user]);
                        if (!user) setUsers([]);
                    }
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
        }, 1000);

        return () => clearTimeout(id);
    }, [keyword, dispatch, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Search
                    isForcusSearch={isFocusSearch}
                    setIsFocusSearch={setIsFocusSearch}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    isShowFormAddFriend={isShowFormAddFriend}
                    setIsShowFormAddFriend={setIsShowFormAddFriend}
                />
                {
                    !isFocusSearch
                        ?
                        <Chat
                            setRoom={setRoom}
                            setUser={setUser}
                            setIsShowChatRoom={setIsShowChatRoom}
                        />
                        :
                        <ResultSearch
                            users={users}
                            rooms={rooms}
                            isLoading={isLoading}
                            setRoom={setRoom}
                            setUser={setUser}
                            setIsShowChatRoom={setIsShowChatRoom}
                        />
                }
            </div>
            <div className={styles.content}>
                {
                    isShowChatRoom &&
                    <RoomChat
                        user={user}
                        room={room}
                    />
                }
            </div>
            {
                isShowFormAddFriend &&
                <FormAddFriend
                    isShow={isShowFormAddFriend}
                    setShow={setIsShowFormAddFriend}
                />
            }
        </div>
    );
}

export default ChatPage;