import User from "./User";

interface Message {
    messageId: string;
    user: User;
    timestamp: string;
    content: string;
}

export default Message;