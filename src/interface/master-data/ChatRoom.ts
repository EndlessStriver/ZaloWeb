interface ChatRoomSingle {
    chatRoomId: string;
    createdAt: string;
    updatedAt: string;
}

interface ChatRoomGroup extends ChatRoomSingle {
    roomName: string;
    roomImage: string;
}

export type { ChatRoomSingle, ChatRoomGroup };