import Message from "./Message";
import { UserChatRoomSingle } from "./UserChatRoom";

interface ChatRoom {
    chatRoomId: string;
    userChatRooms: UserChatRoomSingle[];
    createdAt: string;
    updatedAt: string;
    roomName?: string;
    roomImage?: string;
    newMessage?: Message;
}

export default ChatRoom;