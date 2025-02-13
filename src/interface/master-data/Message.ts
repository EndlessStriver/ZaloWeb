import User from "./User";

interface Message {
    messageId: string;
    user: User;
    timestamp: string;
    content?: string;
    imageUrl?: string;
    imageName?: string;
    typeImage?: string;
    fileUrl?: string;
    fileName?: string;
    typeFile?: string;
}

export default Message;