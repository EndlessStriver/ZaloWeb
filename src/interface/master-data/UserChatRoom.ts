import User from "./User";

interface UserChatRoomSingle {
    userChatRoomId: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}

interface UserChatRoomGroup {
    userChatRoomId: string;
    user: User;
    createdAt: string;
    updatedAt: string;
    role: string;
}

export type { UserChatRoomSingle, UserChatRoomGroup };