interface RefreshToken {
    accessToken: string;
}

interface RegisterRequest {
    firstName: string,
    lastName: string,
    gender: string,
    birthday: string,
    phoneNumber: string,
    email: string,
    username: string,
    password: string,
}

export type { RefreshToken, RegisterRequest }