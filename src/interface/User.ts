interface User {
    userId: string;
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
    birthday: string;
    phoneNumber: string | null;
    email: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export default User;