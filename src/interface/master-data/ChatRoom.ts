import { UserChatRoomSingle } from "./UserChatRoom";

interface ChatRoom {
    chatRoomId: string;
    userChatRooms: UserChatRoomSingle[];
    createdAt: string;
    updatedAt: string;
    roomName?: string;
    roomImage?: string;
}

export default ChatRoom;