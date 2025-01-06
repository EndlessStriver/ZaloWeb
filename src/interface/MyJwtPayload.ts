interface MyJwtPayload {
    type: "ACCESS" | "REFRESH",
    sub: string,
    iat: number,
    exp: number
}

export default MyJwtPayload;