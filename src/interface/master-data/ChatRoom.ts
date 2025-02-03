import { UserChatRoomSingle } from "./UserChatRoom";

interface ChatRoomSingle {
    chatRoomId: string;
    userChatRooms: UserChatRoomSingle[];
    createdAt: string;
    updatedAt: string;
}

interface ChatRoomGroup {
    chatRoomId: string;
    userChatRooms: UserChatRoomSingle[];
    createdAt: string;
    updatedAt: string;
    roomName: string;
    roomImage: string;
}

export type { ChatRoomSingle, ChatRoomGroup };