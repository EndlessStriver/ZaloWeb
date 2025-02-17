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

const createImageMessage = async (chatRoomId: string, image: File): Promise<Message> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('chatRoomId', chatRoomId);
    formData.append('file', image);

    const response = await axios.post(`${API_ENDPOINT}/messages/images`, formData, { headers: { Authorization: `Bearer ${accessToken}` } });
    return response.data.data
}

const createFileMessage = async (chatRoomId: string, file: File): Promise<Message> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('chatRoomId', chatRoomId);
    formData.append('file', file);

    const response = await axios.post(`${API_ENDPOINT}/messages/files`, formData, { headers: { Authorization: `Bearer ${accessToken}` } });
    return response.data.data
}

const createTextMessage = async (chatRoomId: string, content: string): Promise<Message> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_ENDPOINT}/messages/text?chatRoomId=${chatRoomId}&content=${content}`, null, { headers: { Authorization: `Bearer ${accessToken}` } });
    return response.data.data
}

export { getMessagesByChatRoomId, createImageMessage, createTextMessage, createFileMessage }