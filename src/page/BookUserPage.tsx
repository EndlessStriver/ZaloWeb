import React, { useContext, useEffect, useState } from 'react'
import styles from './bookUserPage.module.css'
import Search from '../component/Search';
import GroupAndFriend from '../component/GroupAndFriend';
import ResultSearch from '../component/ResultSearch';
import { ChatRoomGroup } from '../interface/master-data/ChatRoom';
import User from '../interface/master-data/User';
import { NotifyContext } from '../context/NotifyContext';
import { MyJwtIsExpired } from '../util/MyJwtDecode';
import { validatePhoneNumber } from '../util/ValidateForm';
import { getByPhoneNumber, getFriendsAndMessageContacts } from '../service/UserService';
import { getChatRoomsByRoomNameAndUserId } from '../service/ChatRoomService';
import axios from 'axios';
import FormAddFriend from '../component/FormAddFriend';
import { Outlet } from 'react-router';

const BookUserPage: React.FC = () => {

    const [keyword, setKeyword] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<ChatRoomGroup[]>([]);
    const [isFocusSearch, setIsFocusSearch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShowFormAddFriend, setIsShowFormAddFriend] = useState<boolean>(false);

    const { dispatch } = useContext(NotifyContext);

    useEffect(() => {
        if (!isFocusSearch) {
            setKeyword('');
            setUsers([]);
            setRooms([]);
        }
    }, [isFocusSearch])

    useEffect(() => {
        const id = setTimeout(async () => {
            if (keyword && await MyJwtIsExpired() === false) {
                try {
                    setIsLoading(true);
                    if (!validatePhoneNumber(keyword)) {
                        const [listFriend, listRoom] = await Promise.all([getFriendsAndMessageContacts(keyword), getChatRoomsByRoomNameAndUserId(keyword)])
                        setUsers(listFriend);
                        setRooms(listRoom);
                    }
                    if (validatePhoneNumber(keyword)) {
                        const user = await getByPhoneNumber(keyword);
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
                    !isFocusSearch ? <GroupAndFriend /> : <ResultSearch users={users} rooms={rooms} isLoading={isLoading} />
                }
            </div>
            <div className={styles.content}>
                <Outlet />
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