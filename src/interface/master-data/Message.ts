import User from "./User";

interface TextMessage {
    messageId: string;
    user: User;
    timestamp: string;
    content: string;
}

export type { TextMessage };