import { ChatRoomGroup } from '../interface/master-data/ChatRoom';
import axios from "axios";

const getChatRoomsByRoomNameAndUserId = async (roomName: string): Promise<ChatRoomGroup[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/chatrooms?roomName=${roomName}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getChatRoomsByRoomNameAndUserId }