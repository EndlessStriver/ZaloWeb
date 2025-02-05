import axios from "axios";
import Message from "../interface/master-data/Message";
import PageResponse from "../interface/PageResponse";

interface PageRequeset {
    currentPage?: number,
    pageSize?: number,
    sortField?: string,
    orderBy?: "asc" | "desc"
}

const getMessagesByChatRoomId = async (chatRoomId: string, option?: PageRequeset): Promise<PageResponse<Message>> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/messages?chatRoomId=${chatRoomId}&currentPage=${option?.currentPage || 0}&pageSize=${option?.pageSize || 20}&sortField=${option?.sortField || "timestamp"}&orderBy=${option?.orderBy || "desc"}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data.data
}

export { getMessagesByChatRoomId }