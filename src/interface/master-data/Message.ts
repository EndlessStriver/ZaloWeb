import User from "./User";

interface Message {
    messageId: string;
    user: User;
    timestamp: string;
    content?: string;
    imageUrl?: string;
    typeImage?: string;
}

export default Message;