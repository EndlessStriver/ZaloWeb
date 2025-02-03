import User from "./User";

interface UserChatRoomSingle {
    userChatRoomId: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}

interface UserChatRoomGroup extends UserChatRoomSingle {
    role: string;
}

export type { UserChatRoomSingle, UserChatRoomGroup };