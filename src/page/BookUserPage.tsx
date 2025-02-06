import React, { useContext, useEffect, useState } from 'react'
import styles from './bookUserPage.module.css'
import Search from '../component/Search';
import ResultSearch from '../component/ResultSearch';
import User from '../interface/master-data/User';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { validatePhoneNumber } from '../util/ValidateForm';
import { getFriendsAndMessageContacts, getUserByPhoneNumber } from '../service/UserService';
import { getChatRoomsByRoomNameAndUserId } from '../service/ChatRoomService';
import axios from 'axios';
import FormAddFriend from '../component/FormAddFriend';
import { Outlet, useNavigate } from 'react-router';
import ChatRoom from '../interface/master-data/ChatRoom';
import RoomChat from '../component/RoomChat';
import GroupAndFriend from '../component/GroupAndFriend';

const BookUserPage: React.FC = () => {

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
                navigate("/auth/login");
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
    }, [keyword, dispatch]);

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
                        <GroupAndFriend
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
                    isShowChatRoom ?
                        <RoomChat
                            user={user}
                            room={room}
                        />
                        :
                        <Outlet />
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

export default BookUserPage;