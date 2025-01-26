import User from "./User";

interface Friendship {
    friendShipId: string;
    user: User;
    friend: User;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default Friendship;
