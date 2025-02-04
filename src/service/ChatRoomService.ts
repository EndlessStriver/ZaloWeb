import { ChatRoomGroup, ChatRoomSingle } from '../interface/master-data/ChatRoom';
import axios from "axios";

const getChatRoomsByRoomNameAndUserId = async (roomName: string): Promise<ChatRoomGroup[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/chatrooms/search?roomName=${roomName}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getChatRoomForUsers = async (friendId: string): Promise<ChatRoomSingle | null> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/chatrooms/between-users?friendId=${friendId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const createSingleChatRoom = async (friendId: string): Promise<ChatRoomSingle> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_ENDPOINT}/chatrooms/create-single?friendId=${friendId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getChatRoomsByRoomNameAndUserId, getChatRoomForUsers, createSingleChatRoom }