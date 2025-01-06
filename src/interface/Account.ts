import User from "./User";

interface Account {
    accountId: string;
    username: string;
    role: "USER" | "ADMIN";
    actived: boolean;
    verified: boolean;
    user: User;
    createdAt: string;
    updatedAt: string;
    accessToken: string;
}

export default Account;